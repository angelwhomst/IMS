import React, { useState } from "react";
import WomensLeatherShoes from "./WomensLeatherShoes";
import MensLeatherShoes from "./MensLeatherShoes";
import GirlsLeatherShoes from "./GirlsLeatherShoes";
import BoysLeatherShoes from "./BoysLeatherShoes";

const ProductCategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Women's Leather Shoes");

  const renderCategory = () => {
    switch (selectedCategory) {
      case "Women's Leather Shoes":
        return <WomensLeatherShoes />;
      case "Men's Leather Shoes":
        return <MensLeatherShoes />;
      case "Girl's Leather Shoes":
        return <GirlsLeatherShoes />;
      case "Boy's Leather Shoes":
        return <BoysLeatherShoes />;
      default:
        return <WomensLeatherShoes />;
    }
  };

  return (
    <div>
      <div className="dropdown-container">
        <label>Select Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-dropdown"
        >
          <option>Women's Leather Shoes</option>
          <option>Men's Leather Shoes</option>
          <option>Girl's Leather Shoes</option>
          <option>Boy's Leather Shoes</option>
        </select>
      </div>
      {renderCategory()}
    </div>
  );
};

export default ProductCategoryPage;
