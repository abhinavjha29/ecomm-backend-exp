import Database from '../../config/database';
import { UserSignupData } from './utils/types.utils';

const prisma = Database.getInstance();

export class UserService {
  async findUserByEmail(email: string) {
    const user = await prisma.users.findUnique({
      where: {
        email: email
      }
    });
    return user;
  }

  async createUser(data: UserSignupData) {
    const { name, email, password, isAdmin } = data;
    const userData = await prisma.users.create({
      data: { name: name, email: email, password: password, is_admin: isAdmin },
      select: {
        user_id: true,
        name: true,
        email: true,
        created_at: true,
        updated_at: true,
        password: false
      }
    });
    return userData;
  }
}
