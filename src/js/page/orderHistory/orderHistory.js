/*-----------------------------------*\
  마이 페이지 - 주문 내역 페이지  # mypage/order
\*-----------------------------------*/

import Navigo from 'navigo';
// const router = new Navigo('/');
import { $ } from '../../utils/dom.js';
import { reload } from '../../importIMGFiles.js';
import { renderPage } from '../../utils/render.js';
import {
  exclamationmark,
  paginationLeft,
  paginationRight,
  calendar,
} from '../../testJaeha.js';
import { getAllTransactions } from '../../api.js';
import { formatDate } from '../../utils/format.js';

/** 거래 완료/취소 확인 함수 */
const checkWhetherTransactionIsDone = (done, isCanceled) => {
  const buttons = `<button class="button cancel-btn orderHistory__list--cancelBtn">주문 취소</button>
                  <button class="button orderfix-btn orderHistory__list--confirmBtn">구매 확정</button>`;
  const emptyButtons = ``;
  if (done || isCanceled) {
    return emptyButtons;
  } else if (!done || !isCanceled) {
    return buttons;
  }
};

/** 마이 페이지 mypage__navigo__container 초기 템플릿 */
export const renderInitMypageTemplate = `
      <div class="mypage__app">
        <div class="mypage__container">
          <div class="mypage__navbar">
            <h1>마이페이지</h1>
            <nav>
              <ul>
                <li>
                  <a href="/mypage/order" data-navigo
                    >주문내역
                    <img src="./public/chevronright.svg" alt="chevronright" />
                  </a>
                </li>
                <li>
                  <a href="/mypage/account" data-navigo
                    >계좌 관리
                    <img src="./public/chevronright.svg" alt="chevronright" />
                  </a>
                </li>
                <li>
                  <a href="/mypage/wishlist" data-navigo
                    >찜한 상품
                    <img src="./public/chevronright.svg" alt="chevronright" />
                  </a>
                </li>
                <li>
                  <a href="/mypage/myPersonalInfoModify" data-navigo
                    >개인 정보 수정
                    <img src="./public/chevronright.svg" alt="chevronright" />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div class="mypage__navigo__container"></div>
        </div>
      </div>
`;

/** 구매내역 초기 템플릿 */
export const handleOrderHistoryInitTemplate = () => {
  const renderOrderHistoryPageInitTemplate = `
  <div class="mypage__orderhistory">
    <h2>주문 내역</h2>
    <div class="calendar-box">
      <input class="calendar-date"></input>
      <img class="calendar-icon icon icon-tabler icon-tabler-calendar-event" src="${calendar}"
        alt="calendar icon">
      <button><img src="${reload}" alt="reload icon"></button>
      <div class="calendar nodisplay">
        <div class="wrapper">
          <div class="curr-date ">
            <span></span>
            <span class="material-symbols-outlined" id="prev">
              chevron_left
            </span>
            <span class="material-symbols-outlined" id="next">
              chevron_right
            </span>
          </div>
          <div class="curr-dates">
            <ul class="weeks">
              <li>Sun</li>
              <li>Mon</li>
              <li>Tue</li>
              <li>Wed</li>
              <li>Thu</li>
              <li>Fri</li>
              <li>Sat</li>
            </ul>
            <ul class="days">
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="products-container">
      <div class="nocontent-box nodisplay">
        <p>
          <img src="${exclamationmark}" alt="exclamationmark">
          <span>주문내역이 존재하지 않습니다.</span>
        </p>
      </div>
      <ul class="products orderHistory__lists"></ul>
    </div>
    <div class="order-history__pagination--btnsContainer"></div>
  </div>
  </div>
  `;
  $('.mypage__navigo__container').innerHTML =
    renderOrderHistoryPageInitTemplate;
};

/** 제품 구매 내역 */
const renderOrderedProductList = (orderedItems) => {
  console.log(orderedItems);
  const orderedProductListTemplate = orderedItems
    .map((item) => {
      const { detailId, product, timePaid, done, isCanceled } = item;
      const { productId, title, price, thumbnail } = product;

      return `
      <li class="product orderHistory__list" data-product-id="${productId}" data-detail-id="${detailId}">
        <img src="${thumbnail}" alt="${title}" class="product--img orderHistory__list--img" />
        <div class="product--info">
          <a href="/mypage/order/${detailId}" class="product--name orderHistory__list--name">${
        title.length > 30 ? title.substring(0, 30).concat(' ...') : title
      }</a>
          <div class="product--info-numbers orderHistory__list--info">
            <div class="product--price orderHistory__list--info-price">${price.toLocaleString()} 원</div>
            <div class="product--order-date orderHistory__list--info-date">${formatDate(
              timePaid,
            )}</div>
          </div>
          <span class="order-status orderHistory__list--orderStatus">${
            done ? '구매 확정' : isCanceled ? '구매 취소' : '대기'
          }</span>
          <span>구매 확정 이후에는 주문 취소가 불가능합니다.</span>
          <span class="orderHistory__list--confirmed-order"></span>
        </div>
        <div class="buttons orderHistory__list--buttons">
          ${checkWhetherTransactionIsDone(done, isCanceled)}
        </div>
      </li>
    `;
    })
    .join('');

  $('.orderHistory__lists').innerHTML = orderedProductListTemplate;
};

/** 주문 내역 skeleton ui 초기 렌더링 */
const renderSkeletonUIinOrderHistoryPage = () => {
  const skeletonUITemplate = `
  <li class="orderHistoryPage__skeleton"></li>
`;
  const skeletonUI12 = Array(12)
    .fill(skeletonUITemplate)
    .map((v, i) => {
      return v;
    })
    .join('');

  $('.orderHistory__lists').innerHTML = skeletonUI12;
};

/** 구매내역이 없을 경우 render 핸들링 함수, 빈 구매내역 template */
const emptyOrderHistory = () => {
  const emptyOrderHistoryTemplate = `
    <div class="cart__empty">
      <img src="${cartSVG}" alt="빈 구매내역" />
      <h3>구매내역이 없습니다.</h3>
      <a href="/category/keyboards">쇼핑하러 가기</a>
    </div>
  `;
  $('.orderHistory__lists').innerHTML = emptyOrderHistoryTemplate;
};

/** 제품 구매 내역 유/무 예외처리 */
const renderOrderedListPage = async () => {
  renderPage(renderInitMypageTemplate);
  handleOrderHistoryInitTemplate();
  renderSkeletonUIinOrderHistoryPage();
  const transactionArr = await getAllTransactions();
  console.log('transactionArr', transactionArr);

  // 주문한 제품 없을 경우
  if (transactionArr.length === 0) {
    emptyOrderHistory();
    // return;
  } else if (transactionArr.length >= 1) {
    // 주문한 제품 있을 경우
    // renderOrderedProductList(transactionArr);
    utilInit();
    // return;
  }
};

/** [주문 내역 페이지] 구매확정/취소 버튼 클릭 이벤트 */
$('.app').addEventListener('click', async (e) => {
  const detailId = e.target.closest('li')?.dataset.detailId;
  if (e.target.classList.contains('orderHistory__list--confirmBtn')) {
    confirmTransactionAPI(detailId);
    e.target
      .closest('li')
      .querySelector('.orderHistory__list--confirmed-order').innerHTML =
      '구매가 확정되었습니다.';
    $('.app').querySelector(
      '.orderHistory__list--confirmed-order',
    ).style.display = 'none';
    return;
  }

  if (e.target.classList.contains('orderHistory__list--cancelBtn')) {
    cancelTransactionAPI(detailId);
    e.target
      .closest('li')
      .querySelector('.orderHistory__list--confirmed-order').innerHTML =
      '구매가 취소되었습니다.';
    $('.app').querySelector('.orderHistory__list--buttons').style.display =
      'none';
    return;
  }
});

/** /mypage/order 핸들링 함수 */
export const handleOrderHistoryPage = async () => {
  $('.modal__addCart').style.display = 'none';
  console.log('/mypage/order');
  await renderOrderedListPage();
};

let utilIndex = 0;
let utilPages = [];

const utilSetupUI = () => {
  renderOrderedProductList(utilPages[utilIndex]);
  utilDisplayButtons(
    $('.order-history__pagination--btnsContainer'),
    utilPages,
    utilIndex,
  );
};

const utilInit = async () => {
  const orderHistory = await getAllTransactions();
  utilPages = utilPaginate(orderHistory);

  utilSetupUI();
};

const utilPaginate = (list) => {
  const itemsPerPage = 10;
  const numberOfPages = Math.ceil(list.length / itemsPerPage);

  const newList = Array.from({ length: numberOfPages }, (_, index) => {
    const start = index * itemsPerPage;

    return list.slice(start, start + itemsPerPage);
  });

  return newList;
};

const utilDisplayButtons = (container, pages, activeIndex) => {
  let utilBtns = pages.map((_, pageIndex) => {
    return `
    <button class="order-history__pagination--btn ${
      activeIndex === pageIndex ? 'active-btn' : 'null'
    }" data-index="${pageIndex}">
      ${pageIndex + 1}
    </button>`;
  });

  utilBtns.push(
    `<button class="order-history__pagination--btn-next">다음</button>`,
  );
  utilBtns.unshift(
    `<button class="order-history__pagination--btn-prev">이전</button>`,
  );
  container.innerHTML = utilBtns.join('');
};

$('.app').addEventListener('click', (e) => {
  if (e.target.classList.contains('order-history__pagination--btnsContainer'))
    return;

  if (e.target.classList.contains('order-history__pagination--btn')) {
    utilIndex = Number(e.target.dataset.index);
    utilSetupUI();
  }

  if (e.target.classList.contains('order-history__pagination--btn-next')) {
    utilIndex++;
    if (utilIndex > utilPages.length - 1) {
      utilIndex = 0;
    }
    utilSetupUI();
  }
  if (e.target.classList.contains('order-history__pagination--btn-prev')) {
    utilIndex--;
    if (utilIndex < 0) {
      utilIndex = utilPages.length - 1;
    }
    utilSetupUI();
  }
});
