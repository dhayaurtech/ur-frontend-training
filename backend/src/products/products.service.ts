
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';


@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private readonly productModel:Model<ProductDocument>){}

  async findAll(page=1, limit=10, search='', category='',sort='title-ascending'){
    const products = await this.productModel.find();
    const filtered = products.filter((product) => {
        const searchTerm = search.toLowerCase();
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) || product.category.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || category === "all" || product.category.toLowerCase() === category.toLowerCase();
        return matchesSearch && matchesCategory;
    });
    const [field, direction] = sort.split('-');

    const sorted = [...filtered].sort((a,b) => {
      let comparison = 0;

      if(field === "title"){
        comparison = a.title.localeCompare(b.title);
      }else if(field === "price"){
        comparison = a.price - b.price
      }else if(field === 'createdat'){
        comparison = new Date(a.meta.createdat).getTime() - new Date(b.meta.createdat).getTime();
      }

      return direction === "ascending" ? comparison : -comparison;
    })

    const start = (page-1)*limit;

    return {
        items:sorted.slice(start,start+limit),
        total:sorted.length,
        page,
        limit
    }
  }

  async findOne(id: string) {
    // return products.find((product) => product.id === Number(id)) ?? null;
    const product = await this.productModel.findById(id) 
    return product ?? null;
  }

  async getCategories(){
    const products = await this.productModel.find();
    return [...new Set(products.map((product) => product.category))];
  }
  
  async addProudct(body:CreateProductDto){
    const {title, category, brand, description, price, stock, images} = body;

    const product = await this.productModel.findOne({title})
    
    if(product){
      throw new ConflictException('Product already exists');
    }

    const now = new Date();

    const newProduct = await this.productModel.create({
      title,
      description, 
      category, 
      price, 
      stock, 
      rating:0, 
      thumbnail:images?.[0] ?? '', 
      images:images ?? [], 
      discountPercentage:0, 
      brand, 
      meta:{
        createdat:now, 
        updatedat:now
      }, 
      reviews:[], 
      weight:0, 
      dimensions:{
        width:0,
        height:0,
        depth:0
      }
      });

    return newProduct;
  }

  async editProduct(id:string, body:UpdateProductDto){
    // const productIndex = products.findIndex((prod) => prod.id === Number(id));
       const product = await this.productModel.findById(id);


    if(!product){
      throw new NotFoundException('Product not found');
    }

    Object.assign(product,body);
    // product.meta.updatedat = new Date();
    product.meta = {
      ...product.meta,
      updatedat:new Date()
    }

    await product.save();

    return product;

    // products[productIndex] = {
    //   ...products[productIndex],
    //   ...body,
    //   meta:{
    //     ...products[productIndex].meta,
    //     updatedat: new Date().toISOString()
    //   }
    // }
    
  }

  async deleteProduct(id:string){
    // const productIndex = products.findIndex((prod) => prod.id === Number(id));

    // if(productIndex === -1){
    //   return null;
    // }

    // const product = await this.productModel.findById(id);

    // if(!product){
    //   return null;
    // }

    // const [deleteProduct] = products.splice(productIndex,1);

    const deletedProduct = await this.productModel.findByIdAndDelete(id);

    if(!deletedProduct){
      throw new NotFoundException('Product not found');
    }

    return deletedProduct;
  }
}

