import * as React from "react";
import { useState, ChangeEvent, FormEvent } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Avatar,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  YouTube,
  Twitter,
  Search,
  MusicNoteOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { IMaskInput } from "react-imask";
import { states } from "../../data/states"; // Importa lista de estados
import Influencer, { SocialMedia } from "../../types/influencer";
import formatSocialMedia from "../../utils/socialMediaFormatter";
import { socialMediaOrderSwapped } from "../../utils/socialMediaOrder";
import { updateInfluencer } from "../../services/influence";

const niches = [
  { name: "tecnologia", label: "Tecnologia" },
  { name: "moda", label: "Moda" },
  { name: "viagem", label: "Viagem" },
  { name: "gastronomia", label: "Gastronomia" },
  { name: "esporte", label: "Esportes" },
  { name: "musica", label: "Música" },
  { name: "saude-bem-estar", label: "Saúde e bem estar" },
  { name: "negocios", label: "Negócios" },
  { name: "design-interior", label: "Design de interiores" },
  { name: "fotografia", label: "Fotografia" },
  { name: "culinaria", label: "Culinária" },
  { name: "educacao", label: "Educação" },
  { name: "games", label: "Games" },
  { name: "sustentabilidade", label: "Sustentabilidade" },
  { name: "automoveis", label: "Automóveis" },
  { name: "viagens", label: "Viagens" },
  { name: "pets", label: "Pets" },
  { name: "vida", label: "Vida" },
  { name: "politica-ativismo", label: "Política e Ativismo" },
  { name: "outros", label: "Outros" },
];

const UpdateInfluencer = () => {
  const navigate = useNavigate();

  //Pega parametro de outro lugar, Valores já armazenados no banco de dados
  const p = useLocation();
  const inf = (p.state.influencer as Influencer) ?? ({} as Influencer);
  const photo = inf.profilePhoto;
  const socialMediaFormatted = formatSocialMedia(inf.influencerSocialMedia ?? []);
  const previousNiches = inf.nicheIds.map((id) => niches[id - 1].name); //-1 porque o banco começa de 1

  //States
  const [loading, setLoading] = useState(false);
  const [loadingImage] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(photo);
  const [socialMedia, setSocialMedia] = useState({
    facebook: socialMediaFormatted.facebook,
    instagram: socialMediaFormatted.instagram,
    youtube: socialMediaFormatted.youtube,
    twitter: socialMediaFormatted.twitter,
    tiktok: socialMediaFormatted.tiktok,
  });
  const [selectedNiches, setSelectedNiches] = useState<string[]>(previousNiches);
  const [state, setState] = useState<string>(states[inf.stateId - 1]); //-1 porque o banco começa de 1 e o array começa de 0
  const [birthdate, setBirthdate] = useState<string>(inf.birthdate ?? "");
  const [name, setName] = useState<string>(inf.name ?? "");
  const [email, setEmail] = useState<string>(inf.email ?? "");
  const [cpf, setCpf] = useState<string>(inf.cpf ?? "");

  const influencerToSend: Influencer = {
    id: inf.id,
    name: name,
    email: email,
    birthdate: birthdate,
    cpf: cpf,
    image: "",
    profilePhoto: preview,
    stateId: states.indexOf(state) + 1,
    //@ts-ignore
    nicheIds: niches.map((niche, index) => (selectedNiches.includes(niche.name) ? index + 1 : undefined))
                    .filter(index => index !== undefined),

    //@ts-ignore
    influencerSocialMedia: Object.keys(socialMedia)
    .map((key) => {
      //@ts-ignore
      if (socialMedia[key] != "")
        //@ts-ignore
        return {socialMediaId: socialMediaOrderSwapped[key],link: socialMedia[key],
        } as SocialMedia;
      else
        return undefined
    })
    .filter((element) => element != undefined)??{}  as SocialMedia[],
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (
      name === "facebook" ||
      name === "instagram" ||
      name === "youtube" ||
      name === "twitter" ||
      name === "tiktok"
    ) {
      setSocialMedia({ ...socialMedia, [name]: value });
    } else if (name === "state") {
      setState(value);
    } else if (name === "birthdate") {
      setBirthdate(value);
    } else if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "cpf") {
      setCpf(value);
    }
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mostrar prévia da imagem selecionada
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    // Validação
    if (!name.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, name: "Campo obrigatório" }));
      setLoading(false);
      return;
    }
    console.log(influencerToSend);
    await updateInfluencer(inf.id, influencerToSend);
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          fontWeight="bold"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Search sx={{ mr: 1 }} /> Editar Perfil
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: "100%" }}>
          <Grid container spacing={2}>
            {/* Foto/Avatar */}
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="profilePicture"
                type="file"
                onChange={handleAvatarChange}
                disabled={loadingImage}
              />
              <label
                htmlFor="profilePicture"
                style={{
                  display: "flex" /* Torna o label um container flexível */,
                  justifyContent: "center" /* Centraliza o conteúdo horizontalmente */,
                  textAlign: "center" /* Alinha o texto centralmente */,
                }}
              >
                {loadingImage ? (
                  <div style={{ width: 100, height: 100 }}>
                    {loadingImage && (
                      <CircularProgress style={{ justifyContent: "center" }} />
                    )}
                  </div>
                ) : (
                  <Avatar
                    src={preview || undefined}
                    sx={{ width: 100, height: 100, cursor: "pointer" }}
                  />
                )}
              </label>
            </Grid>

            {/* Nome */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Nome"
                value={name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            {/* Email com máscara */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            {/* Estado */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="state-label">Estado</InputLabel>
                <Select
                  labelId="state-label"
                  id="state"
                  name="state"
                  value={state}
                  onChange={(e) => setState(e.target.value as string)}
                  label="Estado"
                >
                  {states.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* Data de Nascimento */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="birthdate"
                name="birthdate"
                label="Data de Nascimento"
                type="date"
                value={birthdate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            {/* CPF */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="cpf"
                name="cpf"
                label="CPF"
                value={cpf}
                onChange={handleChange}
                error={!!errors.cpf}
                helperText={errors.cpf}
                InputProps={{
                  inputComponent: CPFMaskCustom as any,
                }}
              />
            </Grid>
            {/* Nichos */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="niches-label">Nichos de Interesse</InputLabel>
                <Select
                  labelId="niches-label"
                  id="niches"
                  name="niches"
                  multiple
                  value={selectedNiches}
                  onChange={(event) => setSelectedNiches(event.target.value as string[])}
                  renderValue={(selected) => (selected as string[]).join(", ")}
                >
                  {niches.map((niche) => (
                    <MenuItem key={niche.name} value={niche.name}>
                      {niche.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* Redes Sociais */}
            <Grid item xs={12}>
              <Typography component="h2" variant="h6">
                Links das Redes Sociais
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="facebook"
                name="facebook"
                label="Facebook"
                value={socialMedia.facebook}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Facebook />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="instagram"
                name="instagram"
                label="Instagram"
                value={socialMedia.instagram}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Instagram />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="youtube"
                name="youtube"
                label="YouTube"
                value={socialMedia.youtube}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <YouTube />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="twitter"
                name="twitter"
                label="Twitter"
                value={socialMedia.twitter}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Twitter />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="tiktok"
                name="tiktok"
                label="Tiktok"
                value={socialMedia.tiktok}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MusicNoteOutlined />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {/* Botão de Submissão */}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                color="primary"
                disabled={loading}
              >
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      left: "50%",
                      marginTop: -12,
                      marginLeft: -12,
                    }}
                  />
                )}
                Finalizar Edição
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

interface TextMaskCustomProps {
  mask: string;
  inputRef: React.Ref<HTMLInputElement>;
}

const CPFMaskCustom = React.forwardRef<HTMLInputElement, TextMaskCustomProps>(
  (props, ref) => {
    const { ...other } = props;
    return <IMaskInput {...other} mask="000.000.000-00" inputRef={ref} />;
  }
);

export default UpdateInfluencer;
