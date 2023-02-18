import Navigo from 'navigo';
import { router } from '../../testJaeha.js';
const $ = (selector) => document.querySelector(selector);
import {
  halo75,
  halo96,
  air96,
  nufolio,
  twilight,
  xmas,
} from '../../importIMGFiles.js';
import { getAllProducts } from '../../api.js';

/*-----------------------------------*\
  #카테고리 페이지 # category js
\*-----------------------------------*/

/** 카테고리 페이지 초기 템플릿 */
export const renderInitCategoryPage = `
  <div class="categoryPage">
    <div class="categoryPage__container">
      <!-- aside -->
      <aside class="categoryPage__aside">
        <div class="categoryPage__aside--container categoryPageSwiper">
          <div class="categoryPage__aside--wrapper">
            <li class="categoryPage__aside--img">
              <img src="${halo96}" alt=halo96" />
            </li>
            <li class="categoryPage__aside--img">
              <img src="${halo75}" alt="halo75" />
            </li>
            <li class="categoryPage__aside--img">
              <img src="${air96}" alt="air96" />
            </li>
            <li class="categoryPage__aside--img">
              <img src="${nufolio}" alt="nufolio" />
            </li>
            <li class="categoryPage__aside--img">
              <img src="${twilight}" alt="twilight" />
            </li>
            <li class="categoryPage__aside--img">
              <img src="${xmas}" alt="xmas" />
            </li>
          </div>
        </div>
        <div class="categoryPage-pagination"></div>
      </aside>
      <!-- category main -->
      <div class="categoryPage__main">
        <div class="categoryPage__main--container">
          <div class="categoryPage__main--filter">
            <div class="categoryPage__main--filter-totalQty"></div>
            <div class="categoryPage__main--filter-sort">
              <select class="categoryPage__main--filter-select" id="categoryPage-filterByPrice">
                <option selected value="reset">정렬</option>
                <option value="LowToHigh">낮은 가격 순</option>
                <option value="HighToLow">높은 가격 순</option>
              </select>
            </div>
          </div>
        </div>
        <ul class="categoryPage__product--lists"></ul>
      </div>
    </div>
  </div>
`;

/** 카테고리 페이지 skeleton ui 초기 렌더링 */
export const renderSkeletonUIinCategoryPage = () => {
  const skeletonUITemplate = `
  <li class="categoryPage__skeleton">
    <div class="categoryPage__skeleton--img"></div>
    <div class="categoryPage__product--info">
      <h3 class="categoryPage__skeleton--title"></h3>
    </div>
  </li>
`;
  const skeletonUI12 = Array(12)
    .fill(skeletonUITemplate)
    .map((v, i) => {
      return v;
    })
    .join('');

  $('.categoryPage__product--lists').innerHTML = skeletonUI12;
};

/** 카테고리 페이지 제품 db에서 불러오기 */
export const renderCategoryProductList = (items) => {
  const categoryProductListTemplate = items
    .map((item) => {
      const { id, price, thumbnail, title, tags } = item;

      return `
    <li class="categoryPage__product--list" data-product-id="${id}" data-category-tag="${tags}">
      <a href="/product/${id}">
        <div class="categoryPage__product--img">
          <img src="${thumbnail}" alt="${title}" />
        </div>
        <div class="categoryPage__product--info">
          <h3 class="categoryPage__product--info-title">
            ${title}
          </h3>
          <span class="categoryPage__product--info-price">
            ${price.toLocaleString()} 원
          </span>
        </div>
      </a>
    </li>
    `;
    })
    .join('');

  $('.categoryPage__product--lists').innerHTML = categoryProductListTemplate;
};

/** 카테고리 태그 필터링 함수 */
export const getProductTags = async () => {
  const allProductArray = await getAllProducts();
  console.log(allProductArray);
  // const allTags = allProductArray.map((items) => {
  //   return items.tags;
  // });
  const filterKeyboardTag = allProductArray.filter((item) => {
    return item.tags[0] === '키보드';
  });

  const filterKeycapTag = allProductArray.filter((item) => {
    return item.tags[0] === '키캡';
  });
  const filterSwitchTag = allProductArray.filter((item) => {
    return item.tags[0] === '스위치';
  });
  const filterAccessoryTag = allProductArray.filter((item) => {
    return item.tags[0] === '액세서리';
  });
  return [
    filterKeyboardTag,
    filterKeycapTag,
    filterSwitchTag,
    filterAccessoryTag,
  ];
};

/** 가격낮은순 정렬 후 렌더링 함수 */
export const getSortedLowToHighPriceProduct = async (i) => {
  const getKeyBoardCategory = await getProductTags();
  const keyboardCategoryProduct = await getKeyBoardCategory[i];
  const LowToHighPrice = keyboardCategoryProduct.sort((a, b) => {
    return a.price - b.price;
  });
  console.log('LowToHighPrice', LowToHighPrice);
  // $('.categoryPage__product--lists').innerHTML = LowToHighPrice;
  // return keyboardCategoryProduct;
  renderCategoryProductList(await LowToHighPrice);
  return;
};

/** 가격높은순 정렬 후 렌더링 함수 */
export const getSortedHighToLowPriceProduct = async (i) => {
  const getKeyBoardCategory = await getProductTags();
  const keyboardCategoryProduct = await getKeyBoardCategory[i];
  const HighToLowPrice = keyboardCategoryProduct.sort((a, b) => {
    return b.price - a.price;
  });
  console.log('HighToLowPrice', HighToLowPrice);
  renderCategoryProductList(await HighToLowPrice);
  return;
};

/** select option에 의해 정렬 */
export const renderCategoryProductBySelect = async (condition, i) => {
  renderSkeletonUIinCategoryPage();
  const getKeyBoardCategory = await getProductTags();

  if (condition === 'reset') {
    return renderCategoryProductList(await getKeyBoardCategory[i]);
  }
  if (condition === 'LowToHigh') {
    return await getSortedLowToHighPriceProduct(i);
  } else if (condition === 'HighToLow') {
    return await getSortedHighToLowPriceProduct(i);
  }
};

/** 카테고리별 상품 개수 렌더링 */
export const renderCategoryProductQty = async (i) => {
  const getKeyBoardCategory = await getProductTags();
  const categoryTotalQty = await getKeyBoardCategory[i];
  $(
    '.categoryPage__main--filter-totalQty',
  ).innerHTML = `${categoryTotalQty.length}개 상품`;
};