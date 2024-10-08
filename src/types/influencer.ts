import Campaign from "./campaign";

// Define a interface Influencer (Influenciador) com as propriedades esperadas
interface Influencer {
  name: string; 
  id: number; 
  image: string; 
  profilePhoto?: string;
  status: string; 
  influencerCampaigns?: Campaign[]; 
  influencerSocialMedia?: SocialMedia[];
  birthdate?: string,
  email? :string,
  cpf?:string,
  stateId: number,
  nicheIds: number[]
}
export default Influencer;

// Define a interface SocialMedia (Rede Social) com as propriedades esperadas
export interface SocialMedia {
  socialMediaId: number; 
  link: string; 
}


