import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
// import { useTheme } from "@mui/material/styles";
import { socialMediaOrderSwapped } from "../../../utils/socialMediaOrder";
import { createCampaign } from "../../../services/campaign";
import Influencer from "../../../types/influencer";
import { getActivesInfluencers } from "../../../services/influence";
import { useNavigate } from "react-router-dom";
import AvatarImage from "../../../components/AvatarImage";
import { Paper } from "@mui/material";
import { useSessionContext } from "../../../contexts/SessionContext";
import Company from "../../../types/company";
import SelectCompany from "../../../components/SelectCompany";
import { getAllCompanies } from "../../../services/company";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface CampaignData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  expecLikes: number;
  expecComments: number;
  expecSaves: number;
  nicheId: number;
  marketingChannelIds: number[];
  companyId: number;
  influencerIds: number[];
  status: "ACTIVE" | "INACTIVE" | "FINISHED";
  logo: string;
}

const checkboxOptionsArr = [
  "Esportes",
  "Música",
  "Moda",
  "Saúde e bem estar",
  "Negócios",
  "Design de interiores",
  "Tecnologia",
  "Fotografia",
  "Culinária",
  "Educação",
  "Games",
  "Sustentabilidade",
  "Automóveis",
  "Viagens",
  "Pets",
  "Vida",
  "Política e Ativismo",
  "Outros",
];

const checkboxOptions = [
  { name: "esporte", label: "Esportes" },
  { name: "musica", label: "Música" },
  { name: "moda", label: "Moda" },
  { name: "saude-bem-estar", label: "Saúde e bem estar" },
  { name: "negocios", label: "Negócios" },
  { name: "design-interior", label: "Design de interiores" },
  { name: "tecnologia", label: "Tecnologia" },
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

const socialMediaOptions = ["facebook", "instagram", "youtube", "tiktok", "twitter"];

type StatusValues = "Ativo" | "Paralisado" | "Finalizado";
type StatusBackend = "ACTIVE" | "INACTIVE" | "FINISHED";
const statusBackend = {
  Ativo: "ACTIVE",
  Paralisado: "INACTIVE",
  Finalizado: "FINISHED",
};
const statusOptions = ["Ativo", "Paralisado", "Finalizado"];

export default function RegisterCampaign() {
  const navigate = useNavigate();
  const sessionCtx = useSessionContext();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedNiche, setSelectedNiche] = useState<string>("");
  const [selectedSocialMedia, setSelectedSocialMedia] = useState<string[]>([]);
  const [status, setStatus] = useState("Ativo" as StatusValues);
  const [budget, setBudget] = useState("Orçamento");
  const [selectedInfluencers, setSelectedInfluencers] = useState<Influencer[]>([]);
  const [selectedCompany, setSelectedCompany] = useState({} as Company);
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");
  const [shares, setShares] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [errors, setErrors] = useState({
    name: false,
    startDate: false,
    endDate: false,
    description: false,
    niches: false,
    socialMedia: false,
    status: false,
    budget: false,
    likes: false,
    comments: false,
    shares: false,
    company: false,
  });
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  //FUNÇÕES PARA CAPTURAR IMAGEM DA CAMPANHA
  const [preview, setPreview] = useState<string | null>(null);

  const campaingData: CampaignData = {
    name: name,
    startDate: startDate,
    endDate: endDate,
    description: description,
    nicheId: checkboxOptionsArr.indexOf(selectedNiche) + 1, //+1 porque id banco de dados não tem 0
    marketingChannelIds: selectedSocialMedia.map(
      // @ts-ignore eu sei que tem os mesmos campos
      (smName) => socialMediaOrderSwapped[smName]
    ),
    status: statusBackend[status] as StatusBackend,
    budget: Number(budget.replace("R$", "").replace(".","").replace(",", ".")),
    expecLikes: Number(likes),
    expecComments: Number(comments),
    expecSaves: Number(shares),
    companyId: selectedCompany.id,
    influencerIds: selectedInfluencers.map((i) => i.id),
    logo: preview ?? "",
  };
  const [activeInfluencers, setActiveInfluencers] = useState([] as Influencer[]);
  const [companies, setCompanies] = useState([] as Company[]);

  useEffect(() => {
    async function setAllInfluencers() {
      const infs = (await getActivesInfluencers()) ?? [];

      setActiveInfluencers(infs);
    }
    async function setAllCompanies() {
      const comps = (await getAllCompanies()) ?? [];

      setCompanies(comps);
    }

    setAllInfluencers();
    setAllCompanies();

    if (sessionCtx.userType == "company") {
      const cData = sessionCtx.userData;
      const company: Company = {
        name: cData.name,
        id: cData.tableId,
        image: cData.profilePhoto ?? "",
        profileLogo: cData.profilePhoto,
        status: "ACTIVE"
      };
      setSelectedCompany(company);
    }
  }, []);

  // const theme = useTheme();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setName(newValue);
    if (attemptedSubmit) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: newValue.length < 3 || newValue.length > 100,
      }));
    }
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
    if (event.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, startDate: false }));
    }
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
    if (event.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, endDate: false }));
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        endDate: new Date(startDate) > new Date(endDate),
      }));
    }
  }, [startDate, endDate]);

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setDescription(newValue);
    setCharacterCount(newValue.length);
    if (attemptedSubmit) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: newValue.length < 20 || newValue.length > 300,
      }));
    }
  };

  const handleNichesChange = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    setSelectedNiche(value);
    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, niches: false }));
    }
  };

  const handleSocialMediaChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedSocialMedia(typeof value === "string" ? value.split(",") : value);
    if (value.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, socialMedia: false }));
    }
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatus(event.target.value as StatusValues);
  };

  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/[^\d]/g, "");
    if (value.length > 0) {
      value =
        "R$ " +
        (parseInt(value, 10) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
    } else {
      value = "";
    }
    setBudget(value);
    if (value !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, budget: false }));
    }
  };

  const handleBudgetFocus = () => {
    if (budget === "Orçamento" || budget === "") {
      setBudget("R$ 0,00");
    }
  };

  const handleBudgetBlur = () => {
    if (budget === "") {
      setBudget("Orçamento");
    }
  };

  const handleInfluencersChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedInfluencers(activeInfluencers.filter((i) => value.includes(i.name)));
  };

  const handleLikesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length > 0) {
      value = parseInt(value).toLocaleString("pt-BR");
    }
    setLikes(value);
    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, likes: false }));
    }
  };

  const handleCommentsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length > 0) {
      value = parseInt(value).toLocaleString("pt-BR");
    }
    setComments(value);
    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, comments: false }));
    }
  };

  const handleSharesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length > 0) {
      value = parseInt(value).toLocaleString("pt-BR");
    }
    setShares(value);
    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, shares: false }));
    }
  };

  const handleCompaniesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedCompany(companies.find((i) => value.includes(i.name)) ?? ({} as Company));
  };

  const validateForm = () => {
    const newErrors = {
      name: name.length < 3 || name.length > 100,
      startDate: !startDate,
      endDate: !endDate || new Date(startDate) > new Date(endDate),
      description: description.length < 20 || description.length > 300,
      niches: selectedNiche.length === 0,
      socialMedia: selectedSocialMedia.length === 0,
      status: !status,
      budget: budget === "R$ 0,00" || budget === "Orçamento",
      likes: !likes,
      comments: !comments,
      shares: !shares,
      company: selectedCompany.id == null,
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttemptedSubmit(true);
    const isFormValid = validateForm();

    if (!isFormValid) {
      return;
    }

    console.log(campaingData);
    await createCampaign(campaingData);
    navigate("/campaigns");
  };

  return (
    <Paper sx={{ width: "fit-content", margin: "auto" }}>
      <Box
        component="form"
        sx={{
          maxWidth: 600,
          padding: 2,
          border: "1px solid #ddd",
          borderRadius: 2,
          boxShadow: 1,
          mt: 5,
          mb: 5,
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Typography variant="h4" gutterBottom align="center">
          Registrar Campanha
        </Typography>
        <Box m={1}>
          <AvatarImage preview={preview} setPreview={setPreview} />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Nome da campanha"
              value={name}
              onChange={handleNameChange}
              error={errors.name}
              helperText={
                errors.name && "Campo obrigatório e deve ter entre 3 e 100 caracteres"
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Data de início"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={startDate}
              onChange={handleStartDateChange}
              error={errors.startDate}
              helperText={errors.startDate && "Campo obrigatório"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Data de término"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={endDate}
              onChange={handleEndDateChange}
              error={errors.endDate}
              helperText={
                errors.endDate && "Data de término não pode ser anterior à data de início"
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Descrição"
              multiline
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
              error={errors.description}
              helperText={
                errors.description
                  ? "Campo obrigatório e deve ter entre 20 e 300 caracteres"
                  : `${characterCount}/300`
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={errors.niches}>
              <InputLabel>Nicho</InputLabel>
              <Select
                value={selectedNiche}
                onChange={handleNichesChange}
                input={<OutlinedInput label="Nicho" />}
                renderValue={(selected) => selected}
                MenuProps={MenuProps}
              >
                {checkboxOptions.map((option) => (
                  <MenuItem key={option.name} value={option.label}>
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
              {errors.niches && (
                <Typography color="error">Selecione ao menos um nicho</Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={errors.socialMedia}>
              <InputLabel>Redes Sociais</InputLabel>
              <Select
                multiple
                value={selectedSocialMedia}
                onChange={handleSocialMediaChange}
                input={<OutlinedInput label="Redes Sociais" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {socialMediaOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={selectedSocialMedia.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
              {errors.socialMedia && (
                <Typography color="error">Selecione ao menos uma rede social</Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Orçamento"
              variant="outlined"
              value={budget}
              onChange={handleBudgetChange}
              onBlur={handleBudgetBlur}
              onFocus={handleBudgetFocus}
              error={errors.budget}
              helperText={errors.budget && "Campo obrigatório"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={errors.status}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={handleStatusChange}
                input={<OutlinedInput label="Status" />}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {errors.status && <Typography color="error">Campo obrigatório</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Influenciadores</InputLabel>
              <Select
                multiple
                value={selectedInfluencers.map((inf) => inf.name)}
                onChange={handleInfluencersChange}
                input={<OutlinedInput label="Influenciadores" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {activeInfluencers.map((inf) => (
                  <MenuItem key={inf.id} value={inf.name}>
                    {inf.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Curtidas"
              value={likes}
              onChange={handleLikesChange}
              error={errors.likes}
              helperText={(errors.likes && "Campo obrigatório") || "Expectativas"}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Comentários"
              value={comments}
              onChange={handleCommentsChange}
              error={errors.comments}
              helperText={errors.comments && "Campo obrigatório"}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Compartilhamentos"
              value={shares}
              onChange={handleSharesChange}
              error={errors.shares}
              helperText={errors.shares && "Campo obrigatório"}
            />
          </Grid>
          {sessionCtx.userType == "adm" ? (
            <Grid item xs={12} sm={4}>
              <SelectCompany
                companies={companies}
                handleCompaniesChange={handleCompaniesChange}
                selectedCompany={selectedCompany}
                error={errors.company}
              />
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button type="submit" variant="contained" color="primary">
            Registrar
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
