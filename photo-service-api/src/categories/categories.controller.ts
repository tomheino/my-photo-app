import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../http-exception.filter';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {}
        
    @Post()
    @ApiOperation({summary: 'Add a new Category'})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseFilters(new HttpExceptionFilter()) // Apply the HttpExceptionFilter
    async createCategor(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        console.log(`createCategory: ${JSON.stringify(createCategoryDto)}`)
        return await this.categoriesService.insertCategory(createCategoryDto);
    }

    @Get()
    @ApiOperation({summary: 'Get all Categories'})
    @ApiResponse({status: 200, description: 'OK'})
    async getCategories(): Promise<Category[]> {
        return await this.categoriesService.getCategories();
    }

    @Get(':id')
    @ApiOperation({summary: 'Get Category by ID'})
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 404, description: 'Matching id not found'})
    async getCategoryById(@Param('id') id: string) {
        return await this.categoriesService.findCategoryById(id);
    }

    @Patch(':id')
    @ApiOperation({summary: 'Update category'})
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 404, description: 'Matching id not found'})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async updateCatgry(
        @Param('id') id: string,
        @Body() updateCategoryDto: CreateCategoryDto): Promise<Category> {
        console.log(`updateCategory: ${JSON.stringify(updateCategoryDto)}`)
        return await this.categoriesService.updateCategory(id, updateCategoryDto);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Delete Category by ID'})
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 404, description: 'Matching id not found'})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async deleteCategory(@Param('id') id: string): Promise<{ message: string }> {
        console.log(`deleteCategory ID: ${JSON.stringify(id)}`)
        await this.categoriesService.deleteCategoryById(id);
        return { message: 'Category deleted successfully' };
    }
}
