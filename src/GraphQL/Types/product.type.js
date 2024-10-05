import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { Category } from "../../../DB/models/index.js";
import { CategoryType } from "./index.js";

const ImageType = new GraphQLObjectType({
  name: "ImagesType",
  description: "Images type",
  fields: {
    customId: { type: GraphQLString },
    URLs: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: "URLType",
          fields: {
            secure_url: { type: GraphQLString },
            public_id: { type: GraphQLString },
            _id: { type: GraphQLID },
          },
        })
      ),
    },
  },
});

const DiscountType = new GraphQLObjectType({
  name: "DiscountType",
  fields: {
    amount: { type: GraphQLFloat },
    type: {
      type: new GraphQLEnumType({
        name: "DiscountTypeEnum",
        values: {
          PERCENTAGE: { value: "Percentage" },
          AMOUNT: { value: "Amount" },
        },
      }),
    },
  },
});

export const productType = new GraphQLObjectType({
  name: "product",
  description: "product type",
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    slug: { type: GraphQLString },
    overview: { type: GraphQLString },
    price: { type: GraphQLFloat },
    appliedPrice: { type: GraphQLFloat },
    stock: { type: GraphQLInt },
    rating: { type: GraphQLFloat },
    category: { type: GraphQLID },
    categoryData: {
      type: CategoryType,
      resolve: async (parent) => {
        return await Category.findById(parent.categoryId);
      },
    },
    subCategory: { type: GraphQLID },
    brand: { type: GraphQLID },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    Images: {
      type: ImageType,
    },
    appliedDiscount: {
      type: DiscountType,
    },
  }),
});
