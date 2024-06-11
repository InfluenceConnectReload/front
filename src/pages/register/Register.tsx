import * as React from "react";
import { useState, ForwardRefRenderFunction } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { IMaskInput } from "react-imask";

interface CopyrightProps {
  sx?: object;
}

function Copyright(props: CopyrightProps) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Seu Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const states = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
  "Fora do País"
];

interface TextMaskCustomProps {
  mask: string;
  inputRef: (ref: HTMLInputElement | null) => void;
}

const TextMaskCustom: ForwardRefRenderFunction<HTMLDivElement, TextMaskCustomProps> = (props) => {
  const { mask, inputRef, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask={mask}
      definitions={{
        '#': /[0-9]/,
      }}
      inputRef={inputRef}
      onAccept={(value: any) => inputRef(value)}
    />
  );
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<string>("Influencer");
  const [state, setState] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return re.test(email);
  };

  const validateCPF = (cpf: string) => {
    const re = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
    return re.test(cpf);
  };

  const validateCNPJ = (cnpj: string) => {
    const re = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
    return re.test(cnpj);
  };

  const validatePassword = (password: string) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.append("profilePicture", profilePicture as Blob);

    let formErrors: { [key: string]: string } = {};

    const email = data.get("email") as string;
    const password = data.get("password") as string;

    if (!validateEmail(email)) {
      formErrors.email = "E-mail inválido";
    }

    if (!validatePassword(password)) {
      formErrors.password = "A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial.";
    }

    if (accountType === "Influencer") {
      const cpf = data.get("cpf") as string;
      if (!validateCPF(cpf)) {
        formErrors.cpf = "CPF inválido";
      }
    } else {
      const cnpj = data.get("cnpj") as string;
      if (!validateCNPJ(cnpj)) {
        formErrors.cnpj = "CNPJ inválido";
      }
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      if (accountType === "Influencer") {
        console.log({
          profilePicture: data.get("profilePicture"),
          name: data.get("name"),
          cpf: data.get("cpf"),
          state: data.get("state"),
          email: data.get("email"),
          birthdate: data.get("birthdate"),
          password: data.get("password"),
        });
      } else {
        console.log({
          logo: data.get("profilePicture"),
          companyName: data.get("companyName"),
          email: data.get("email"),
          cnpj: data.get("cnpj"),
          password: data.get("password"),
        });
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4" fontWeight="bold">
          Influence Connect
        </Typography>
        <ButtonGroup variant="contained" aria-label="Basic button group" sx={{ mb: 3, mt: 2 }}>
          <Button
            variant={accountType === "Influencer" ? "contained" : "outlined"}
            onClick={() => setAccountType("Influencer")}
          >
            Influencer
          </Button>
          <Button
            variant={accountType === "Empresa" ? "contained" : "outlined"}
            onClick={() => setAccountType("Empresa")}
          >
            Empresa
          </Button>
        </ButtonGroup>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="profilePicture"
                type="file"
                onChange={handlePictureChange}
              />
              <label htmlFor="profilePicture">
                <Avatar
                  src={preview || undefined}
                  sx={{ width: 100, height: 100, cursor: 'pointer' }}
                />
              </label>
            </Grid>
            {accountType === "Influencer" ? (
              <>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Nome"
                    name="name"
                    autoComplete="name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="cpf"
                    name="cpf"
                    label="CPF"
                    InputProps={{
                      inputComponent: TextMaskCustom as any,
                      inputProps: { mask: "000.000.000-00" },
                    }}
                  />
                  {errors.cpf && <Typography color="error">{errors.cpf}</Typography>}
                </Grid>
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
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="E-mail"
                    name="email"
                    autoComplete="email"
                    error={!!errors.email}
                                       helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="birthdate"
                    label="Data de Nascimento"
                    name="birthdate"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="companyName"
                    label="Nome da Empresa"
                    name="companyName"
                    autoComplete="companyName"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="E-mail"
                    name="email"
                    autoComplete="email"
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="cnpj"
                    name="cnpj"
                    label="CNPJ"
                    InputProps={{
                      inputComponent: TextMaskCustom as any,
                      inputProps: { mask: "00.000.000/0000-00" },
                    }}
                  />
                  {errors.cnpj && <Typography color="error">{errors.cnpj}</Typography>}
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            color="primary"
          >
            Cadastrar
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link onClick={() => navigate(`/`)} variant="body2">
                Já tem uma conta? Entrar
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
};

export default Register;



