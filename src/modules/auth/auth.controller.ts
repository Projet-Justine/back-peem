import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Connexion utilisateur' })
  async login(@Body() body: { email: string; motDePasse: string }) {
    const user = await this.authService.validateUser(body.email, body.motDePasse);
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Inscription étudiant ou personnel' })
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Get('users')
  @ApiOperation({ summary: 'Liste des utilisateurs de la plateforme EMIT' })
  async getUsers() {
    return this.authService.getAllUsers();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Profil d un utilisateur' })
  async getUser(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }
}
