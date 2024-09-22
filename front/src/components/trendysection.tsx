"use client";
import React, { useEffect, useState } from "react";
import { Product } from "../type/product";
import SliderButton from "./sliderButtons";
import GotToSlide from "./gotToSlide";
import ProductCard from "./productCard";

const TrendySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/product/all?collectionName=Royal%20Love"
        );
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="relative mb-[60px]">
      <div
        className="relative w-[1360px] flex flex-col items-center"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <h3 className="text-4xl pt-16">Trendy Collection</h3>
        <h4 className="pb-8 text-lg text-gray-600">
          Collect your loves with our newest arrivals.
        </h4>

        <div className="overflow-hidden ">
          <div
            className="flex transition-transform duration-500 cursor-pointer"
            style={{ transform: `translateX(-${currentIndex * 25}%)` }}
          >
            <ProductCard products={products} />
          </div>
        </div>
        <SliderButton
          products={products}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          hovered={hovered}
        />
      </div>

      <GotToSlide
        products={products}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
};

export default TrendySection;
