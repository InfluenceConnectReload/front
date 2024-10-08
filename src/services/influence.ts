import Influencer from "../types/influencer";
import api from "./api";
//import Influencer from "../types/influencer";

// Função para obter todos os influenciadores
const getAllInfluencers = async () => {
  try {
    const res = await api.get("/influencers");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// Função para obter todos os influenciadores de forma paginada
const getAllInfluencersPageable = async (page: number, pageSize: number) => {
  try {
    const res = await api.get(`/influencers/pageable?page=${page}&pageSize=${pageSize}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// Função para obter o número de influenciadores
const getNumbersOfInfluencers = async () => {
  try {
    const res = await api.get("/influencers/count");
    return res.data;
  } catch (error) {
    console.log("Error getting numbers of influencers: " + error);
  }
};

// Função para desativar um influenciador
const desactiveInfluencer = async (id: number) => {
  changeInfluencerStatus(id, "INACTIVE");
};

// Função para ativar um influenciador
const activeInfluencer = async (id: number) => {
  changeInfluencerStatus(id, "ACTIVE");
};

// Função para mudar o status de um influenciador
const changeInfluencerStatus = async (id: number, status: string) => {
  try {
    const res = await api.patch(`/influencers/status/${id}`, { statusType: status });
    console.log(res);
  } catch (error) {
    console.log(`Error updating influencer ${id} status: ${error}`);
  }
};

// Função para atualizar um influenciador
const updateInfluencer = async (id: number, influencer: Influencer) => {
  
  try {
    const res = await api.put(`/influencers/${id}`, influencer);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(`Error updating influencer with id ${id}: ${error}`);
  }
};

// Função para obter um influenciador pelo ID
const getInfluencerById = async (id: number) => {
  try {
    const res = await api.get(`/influencers/${id}`);
    return res.data;
  } catch (error) {
    console.log(`Error getting influencer with id ${id}: ${error}`);
  }
};

//Função para obter influenciadores ativos
const getActivesInfluencers = async () => {
  try {
    const res = await api.get("/influencers/active");
    console.log(res);
    return res.data as Influencer[];
  } catch (error) {
    console.log("Error on getActivesInfluencers: " + error);
  }
};

const getPageableInfluencersByTerm = async(term: string, page: number, pageSize: number) =>{

  try {
    const res = await api.get(`influencers/pageable/${term}?page=${page}&pageSize=${pageSize}`);
    return res;
  } catch (error) {
    console.error("Error getPageableInfluencersByTerm: " + error);
    return null;
  }
}

export {
  updateInfluencer,
  getInfluencerById,
  getAllInfluencers,
  getAllInfluencersPageable,
  getNumbersOfInfluencers,
  desactiveInfluencer,
  activeInfluencer,
  getActivesInfluencers,
  getPageableInfluencersByTerm
};
