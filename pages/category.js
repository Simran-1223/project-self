import { useState } from "react";
import PageHeader from "../components/PageHaeder";
import Products from "../data/Product/Products.json";
import ProductSingle from "../components/common/ProductSingle";

var productList = Products;

const PageHeaderText = {
  linkText: "Home",
  heading: "Category",
};

const Category = () => {
  const [products, setshowProducts] = useState(productList);

  const productSearch = (keyword) => {
    if (keyword != "") {
      var productListFiltered = Products.filter((item) => {
        var productTag = item.tags.toLowerCase();
        var searchkeyword = keyword.toLowerCase();
        return productTag.includes(searchkeyword);
      });
      setshowProducts(productListFiltered);
    } else {
      setshowProducts(productList);
    }
  };

  return (
    <div>
      <PageHeader text={PageHeaderText} />
      <section className="explore-section padding-top padding-bottom">
        <div className="container">
          <div className="section-wrapper">
            <div className="row gy-5 flex-row-reverse">
              <div className="col-lg-12">
                <div className="explore-wrapper explore-load">
                  <div className="row g-4">
                    {products.map((item) => (
                      <div className="col-xl-4 col-md-6" key={item.id}>
                        <ProductSingle data={item} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Category;
