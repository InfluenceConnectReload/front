import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  CardMedia,
  IconButton,
  Stack,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { YouTube } from "@mui/icons-material";
import { useSessionContext } from "../../contexts/SessionContext";
import Influencer from "../../types/influencer";
import { activeInfluencer, desactiveInfluencer } from "../../services/influence";
import Campaign from "../../types/campaign";
import { addInfluencerToCampaign } from "../../services/campaign";
import formatSocialMedia from "../../utils/socialMediaFormatter";
import { useNavigate } from "react-router-dom";

// Interface que define as propriedades do modal de detalhes do influenciador
interface InfluencerDetailModalProps {
  influencer: Influencer | null;
  open: boolean;
  onClose: () => void;
  refresh: React.Dispatch<React.SetStateAction<number>>;
  campaigns: Campaign[];
}

// Estilo do modal
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

// Função para renderizar itens de campanhas de influenciadores
const influencerCampaignsItems = (campaigns: Campaign, index: number) => (
  <Typography
    key={index}
    variant="body2"
    color="text.secondary"
    sx={{ border: "0.3px solid gray", borderRadius: 1, paddingInline: 1 }}
  >
    {campaigns.name}
  </Typography>
);

// Componente de modal de detalhes do influenciador
const InfluencerDetailModal: React.FC<InfluencerDetailModalProps> = ({
  influencer,
  open,
  onClose,
  refresh,
  campaigns,
}) => {
  // Se não houver influenciador selecionado, retorna null
  if (!influencer) return null;

  //Navigador entre página
  const navigate = useNavigate();

  // Obtenção do tipo de usuário do contexto da sessão
  const { userType } = useSessionContext();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string[]>([]);
  const socialMedias = formatSocialMedia(influencer.influencerSocialMedia ?? []);

  // Função para lidar com a mudança na seleção de campanha
  const handleCampaignChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedCampaignId(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="influencer-modal-title"
      aria-describedby="influencer-modal-description"
    >
      <Box sx={style}>
        {/* Botão para fechar o modal */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Imagem do perfil do influenciador */}
        <CardMedia
          component="img"
          alt={influencer.name}
          height="200"
          image={influencer.profilePhoto || influencer.image}
        />

        {/* Nome e status do influenciador */}
        <Typography id="influencer-modal-title" variant="h5" component="div">
          {influencer.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          id="influencer-modal-description"
        >
          {influencer.status}
        </Typography>

        {/* Lista de campanhas do influenciador */}
        <Stack>
          {influencer.influencerCampaigns?.length != 0 &&
          influencer.status != "INACTIVE" ? (
            <Stack direction={"row"} spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Campanhas:
              </Typography>
              <Stack direction={"row"} spacing={1}>
                {influencer.influencerCampaigns?.map((c, i) =>
                  influencerCampaignsItems(c, i)
                )}
              </Stack>
            </Stack>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              id="influencer-modal-description"
            >
              {" "}
              Não é ativo em campanhas
            </Typography>
          )}
        </Stack>

        {/* Ícones de redes sociais do influenciador */}
        <Box sx={{ mt: 2 }}>
          {socialMedias.facebook.length > 0 ? (
            <IconButton href={socialMedias.facebook} target="_blank">
              <FacebookIcon />
            </IconButton>
          ) : null}
          {socialMedias.instagram.length > 0 ? (
            <IconButton href={socialMedias.instagram} target="_blank">
              <InstagramIcon />
            </IconButton>
          ) : null}
          {socialMedias.twitter.length > 0 ? (
            <IconButton href={socialMedias.twitter} target="_blank">
              <TwitterIcon />
            </IconButton>
          ) : null}
          {socialMedias.youtube.length > 0 ? (
            <IconButton href={socialMedias.youtube} target="_blank">
              <YouTube />
            </IconButton>
          ) : null}
          {socialMedias.tiktok.length > 0 ? (
            <IconButton href={socialMedias.tiktok} target="_blank">
              <Typography color="text.secondary">🎵</Typography>
            </IconButton>
          ) : null}
        </Box>

        {/* Formulário para adicionar influenciador a uma campanha */}
        <Stack spacing={2} marginTop={1}>
          <FormControl fullWidth sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <InputLabel id="demo-simple-select-label">Campanha</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedCampaignId}
              label="Campanha"
              onChange={handleCampaignChange}
              fullWidth
            >
              {campaigns.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="outlined"
              disabled={influencer.status == "PENDING" || influencer.status == "INACTIVE"}
              onClick={async () => {
                if (typeof selectedCampaignId == typeof []) return;

                await addInfluencerToCampaign(Number(selectedCampaignId), influencer.id);
                refresh((p) => p + 1);
              }}
            >
              Adicionar a Campanha
            </Button>
          </FormControl>

          {/* Botões de editar, ativar e desativar influenciador */}
          <Stack spacing={1} direction={"row"}>
            {userType == "adm" ? (
              <>
                <Button
                  variant="contained"
                  onClick={() =>
                    navigate("/updateInfluencer", { state: { influencer: influencer } })
                  }
                >
                  Editar
                </Button>
                {influencer.status == "ACTIVE" ? (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={async () => {
                      await desactiveInfluencer(influencer.id);
                      influencer.status = "INACTIVE";
                      refresh((prevV) => prevV + 1);
                    }}
                  >
                    {" "}
                    Desativar{" "}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={async () => {
                      await activeInfluencer(influencer.id);
                      influencer.status = "ACTIVE";
                      refresh((prevV) => prevV + 1);
                    }}
                  >
                    {" "}
                    Ativar{" "}
                  </Button>
                )}
              </>
            ) : null}
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default InfluencerDetailModal;
