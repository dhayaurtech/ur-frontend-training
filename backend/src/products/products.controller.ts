import { Controller, Get, Query, Param, UseGuards, NotFoundException, Post, Body, Patch, UseInterceptors,UploadedFile, BadRequestException, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get products with search and pagination' })
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
    @Query('category') category='',
    @Query('sort') sort = "title-ascending"
  ) {
    return this.productsService.findAll(
      Math.max(1, Number(page) || 1),
      Math.min(100, Math.max(1, Number(limit) || 10)),
      search,
      category,
      sort
    );
  }


  @Get('categories')
  @ApiOperation({summary:'Get product categories'})
  getCategories(){
    return this.productsService.getCategories();
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get one product by ID' })
  findOne(@Param('id') id: string) {
    const product = this.productsService.findOne(id);

    if (!product) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Product not found',
      });
    }

    return product;
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file',{
      storage: diskStorage({
        destination:'./uploads',
        filename:(req,file,callback) => {
          const uniqueName = `${Date.now()}-${extname(file.originalname).toLowerCase()}`;
          callback(null,uniqueName);
        }
      }),
      limits:{
        fileSize:5*1024*1024
      },
      fileFilter:(req,file,callback) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if(!allowedTypes.includes(file.mimetype)){
          return callback(new BadRequestException('Only JPEG, PNG, and WebP images are allowed'),false);
        }

        callback(null,true);
      }
    })
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Please upload an image');
    }

    return {
      url: `http://localhost:3001/uploads/${file.filename}`,
    };
  }

  
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({summary:'Create a product'})
  create(@Body() body:CreateProductDto){
    return this.productsService.addProudct(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({summary:'Edit a product by ID'})
  updateOne(@Param('id') id:string, @Body() body:UpdateProductDto){
    // const product = this.productsService.findOne(id);

    // if(!product){
    //   throw new NotFoundException({
    //     statusCode:404,
    //     message:'Product not found'
    //   })
    // }

    return this.productsService.editProduct(id,body)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({summary:"Delete a product by ID"})
  deleteOne(@Param('id') id:string){
    // const product = this.productsService.findOne(id);

    // if(!product){
    //   throw new NotFoundException({statusCode:404, message:'Product not found'})
    // }

    return this.productsService.deleteProduct(id);
  }
}
