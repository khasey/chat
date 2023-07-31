import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';


@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  // ===== Récupérer la liste des utilisateurs =====
@Get('users')
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }


// ===== Récupérer la liste des usernames =====
@Get('username')
async getAllUsernames(): Promise<string[]> {
  return this.userService.getAllUsernames();
}

 // ===== Récupérer la liste des usernames pour l'autocomplétion =====
  @Get('autocomplete/:query') // <=== Un doute sur l'utilité de ce get
  async getAutocompleteUsernames(@Param('query') query: string) {
    return this.userService.getAutocompleteUsernames(query);
  }

  @Get('users/username/id')
async getAllUsernamesId(): Promise<{ id: number; username: string }[]> {
  return this.userService.getAllUsernamesId();
}

// UserController

@Put('users/:userId/friends') 
  async addFriend(@Param('userId') userId: number, @Body() body): Promise<User> {
      const { friendId } = body;
      return this.userService.addFriend(userId, friendId);
  }

@Put('users/:userId/blocked') 
  async addBlocked(@Param('userId') userId: number, @Body() body): Promise<User> {
      const { blockedId } = body;
      return this.userService.addBlocked(userId, blockedId);
  }
  @Get('users/:id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.getUserById(id);
  }
  @Get('users/:userId/friends')
  async getFriends(@Param('userId') userId: number): Promise<User[]> {
    return this.userService.getFriends(userId);
  }
  @Get('users/:userId/blocked')
  async getBlockedUsers(@Param('userId') userId: number): Promise<number[]> {
    return this.userService.getBlockedUsers(userId);
  }
  
}