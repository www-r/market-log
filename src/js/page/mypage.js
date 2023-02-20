// dotenv 사용 예시
import chevronrightSVG from '../../../public/chevronright.svg';
const $ = (selector) => document.querySelector(selector);
let navliList;

/** HTML : mypage nav 목록 */
export const htmlMypage_Nav = /* html */ `
<div class="mypage__app">
  <div class="mypage__container">
    <div class="mypage__navbar">
      <h1>마이페이지</h1>
      <nav>
        <ul>
          <li>
            <a href="/mypage/orderHistory" data-navigo id="mpOrderHistory">주문 내역
              <img src="${chevronrightSVG}" alt="chevronright">
            </a>
          </li>
          <li>
            <a href="/mypage/account" data-navigo id="mpAccount">계좌 관리
              <img src="${chevronrightSVG}" alt="chevronright">
            </a>
          </li>
          <li>
            <a href="/mypage/myHeart" data-navigo id="mpMyHeart">찜한 상품
              <img src="${chevronrightSVG}" alt="chevronright">
            </a>
          </li>
          <li>
            <a href="/mypage/myPersonalInfoModify" data-navigo id="mpMyPersonalInfoModify">개인 정보 수정
              <img src="${chevronrightSVG}" alt="chevronright">
            </a>
          </li>
        </ul>
      </nav>
    </div>
  <div class="mypage__navigo__container"></div>
</div>
`;

/** 초기화면 Render시 Inititalize */
export function initFuncMypage() {}

/** mypage 영역을 Render */
export function renderMyPageNav(html) {
  $('.app').innerHTML = htmlMypage_Nav;
  $('.app').querySelector('.mypage__navigo__container').innerHTML = html;
  resetliActive();
}

/** mypage nav탭 선택시 영역 acitve */
function resetliActive() {
  navliList = document.querySelectorAll('.mypage__navbar nav ul li a');
  navliList.forEach((navli) => navli.classList.remove('active'));
}
