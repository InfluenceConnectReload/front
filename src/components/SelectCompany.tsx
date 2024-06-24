import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import Company from "../types/company";

interface ComponentProps {
  companies: Company[];
  handleCompaniesChange: (event: SelectChangeEvent<string[]>) => void;
  selectedCompany: Company;
  error: boolean;
}

const SelectCompany: React.FC<ComponentProps> = ({
  companies,
  selectedCompany,
  handleCompaniesChange,
  error,
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Empresa </InputLabel>
      <Select
        value={companies
          .filter((comp) => comp.id == selectedCompany.id)
          .map((e) => e.name)}
        onChange={handleCompaniesChange}
        input={<OutlinedInput label="Influenciadores" />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {companies.map((inf) => (
          <MenuItem key={inf.id} value={inf.name}>
            {inf.name}
          </MenuItem>
        ))}
      </Select>
      {error && <Typography color="error">Selecione a empresa da campanha</Typography>}
    </FormControl>
  );
};

export default SelectCompany;
