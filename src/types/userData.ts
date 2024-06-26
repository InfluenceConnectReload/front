import { usersType } from "./users";

//esses dados vão ficar salvo no navegador, armazenado em cache
interface UserData {
  id: number; //ID da tabela user
  tableId: number //id da table específica company_id ou influencer_id
  name: string;
  userType?: usersType
  profilePhoto?: string;
  status: string
}

export default UserData;
