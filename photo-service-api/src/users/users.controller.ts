import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { CreateUserWithEmbeddedProfileDto } from './dto/create-user-with-embedded-profile.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserWithEmbeddedProfileDto } from './dto/update-user-with-embedded-profile.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiOperation({summary: 'Create a new User'})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async createUserWithEmbeddedProfile(@Body() createUserWithEmbeddedProfileDto: CreateUserWithEmbeddedProfileDto): Promise<User> {
        console.log(`createUserWithEmbeddedProfile: ${JSON.stringify(createUserWithEmbeddedProfileDto)}`)
        return await this.usersService.insertUserWithEmbeddedProfile(createUserWithEmbeddedProfileDto);
    }

    @Get()
    @ApiOperation({summary: 'Get all Users'})
    @ApiResponse({status: 200, description: 'OK'})
    async getUsers(): Promise<User []> {
        return await this.usersService.getUsers();
    }

    @Get(':id')
    @ApiOperation({summary: 'Get User by ID'})
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 404, description: 'Matching id not found'})
    async getUserById(@Param('id') id: string) {
        return await this.usersService.findUserById(id);
    }

    @Patch(':id')
    @ApiBearerAuth()    
    @ApiOperation({summary: 'Update User'})
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 404, description: 'Matching id not found'})
    @UseGuards(JwtAuthGuard)
    async updateUserWithEmbeddedProfileDto(
        @Param('id') id: string,
        @Body() updateUserWithEmbeddedProfileDto: UpdateUserWithEmbeddedProfileDto): Promise<User> {
        console.log(`updateUser: ${JSON.stringify(updateUserWithEmbeddedProfileDto)}`)
        return await this.usersService.updateUserById(id, updateUserWithEmbeddedProfileDto);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Delete User by ID'})
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 404, description: 'Matching id not found'})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
        console.log(`deleteUser ID: ${JSON.stringify(id)}`)
        await this.usersService.deleteUserById(id);
        return { message: 'User deleted successfully' };
    }
}
