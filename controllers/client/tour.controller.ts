import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";
import sequelize from "../../config/database";
import Tour from "../../models/tour.model";
import  { Request, Response } from "express";
import { QueryTypes } from "sequelize";


// [GET] /tours/:slugCategory
export const index = async (req: Request, res: Response) => {
  const slugCategory = req.params.slugCategory;

  const tours = await sequelize.query(`
  SELECT tours.*, ROUND(price * (1 - discount / 100), 0) AS price_special
  FROM tours
  JOIN tours_categories ON tours.id = tours_categories.tour_id
  JOIN categories ON tours_categories.category_id = categories.id
  WHERE
    categories.slug = '${slugCategory}'
    AND categories.deleted = false
    AND categories.status = 'active'
    AND tours.deleted = false
    AND tours.status = 'active';
  `, {
    type: QueryTypes.SELECT
  });

  tours.forEach(item => {
    if(item["images"]) {
      const images = JSON.parse(item["images"]);
      item["image"] = images[0];
    }

    item["price_special"] = parseFloat(item["price_special"]);
  })

  res.render("client/pages/tours/index", {
    pageTitle: "Danh sách tour",
    tours: tours
  });
}

// [GET] /tours/detail/:slugCategory
export const detail = async (req: Request, res: Response) => {
  const slugTour = req.params.slugTour;


  const tourDetail = await Tour.findOne({
    where: {
      slug: slugTour,
      deleted: false,
      status: "active"
    },
    raw: true
  });
  if(tourDetail["images"]) {
    tourDetail["images"] = JSON.parse(tourDetail["images"]);
  }
  console.log(tourDetail["images"]);
  tourDetail["price_special"] = tourDetail["price"] * (1 - tourDetail["discount"]/100);


 

  res.render("client/pages/tours/detail", {
    pageTitle: "Chi tiết tour",
    tourDetail: tourDetail
  });
}