import * as React from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CompanyInterface from "../../Interfaces/CompanyInterface";
import Grid from "@mui/material/Grid";
import _ from "lodash";
import TextField from "@mui/material/TextField";

import CssBaseline from "@mui/material/CssBaseline";
import { useSnackbar } from "react-simple-snackbar";

const theme = createTheme();

export default function Entries() {
  const [password, setPassword] = React.useState({});
  const [rows, setRows] = React.useState([]);
  const [companyEdits, setComapnyEdits] = React.useState({})
  const [companies, setCompanies] = React.useState([]);
  const [openSnackbar, closeSnackbar] = useSnackbar();

  let companyList = []

  React.useEffect(() => {
    CompanyInterface.getAll().then((results) => {
      setCompanies(results?.data?.data);
    });
  }, []);

  const handleSubmit = (company) =>{
    let edits = companyEdits[company.companyName]
    let payLoad = {
      password,
      companyName: company.companyName,
      pKey: edits.pkey,
      contractAddress: edits.contractAddress,
      status: "VERIFIED"
    }
    CompanyInterface.verifyCompany(payLoad).then(success =>{
      openSnackbar("Company verified", 10000);
    }).catch(err =>{
      openSnackbar("Failed to verify company", 10000);
    })
  }

  const editCompanyMap = (company,e) =>{
    let updatedState = {
      ...companyEdits
    }
    let previousCompanyValue = updatedState[company.companyName] || {}
    if(e){
      previousCompanyValue[e.target.name] = e.target.value
      updatedState[company.companyName] = previousCompanyValue
      setComapnyEdits(updatedState)
    }
  }

  return (
    <ThemeProvider theme={theme} style={{display: "flex", alignItems:"center"}}>
      <TextField
         onChange={(e) => {
          setPassword(e.target.value)
          
        }}
        margin="normal"
        style={{width:"100%"}}
        type="password"
        required
        fullWidth
        name="password"
        label="password"
        id="password"
        autoComplete="password"
      />
      
      <Grid
        container
        component="main"
        sx={{ height: "100vh" }}
        style={{ justifyContent: "center" }}
      >
        <CssBaseline />
        <TableContainer component={Paper}>
          <Table sx={{  }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="center">Jurisdiction</TableCell>
                <TableCell align="center">Reg Number</TableCell>
                <TableCell align="center">Phone </TableCell>
                <TableCell align="center">website</TableCell>
                <TableCell align="center">Address</TableCell>
                <TableCell align="center">LinkedIn</TableCell>
                 <TableCell align="center">Contract address</TableCell>
                 <TableCell align="center">Private key</TableCell>
                 <TableCell align="right">Verify</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { companies && companies.map((company) => (
                <TableRow
                  key={company._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{company.companyName}</TableCell>
                  <TableCell align="center">{_.get(company,'details.Jurisdiction')}</TableCell>
                  <TableCell align="center">{_.get(company,'details.registration')}</TableCell>
                  <TableCell align="center">{_.get(company,'details.phone')}</TableCell>
                  <TableCell align="center">{_.get(company,'details.website')}</TableCell>
                  <TableCell align="center">{_.get(company,'details.address')}</TableCell>
                  <TableCell align="center">{_.get(company,'details.linkedIn')}</TableCell>
                  <TableCell align="center">
                    {
                      company.status == "VERIFIED" ? company.contractAddress: 
                      <TextField
                        onChange={(e) => {
                          editCompanyMap(company,e)
                        }}
                        margin="normal"
                        name="contractAddress"
                        required
                        fullWidth
                      />
                    } 
                  </TableCell>
                 <TableCell align="center">  
                 {
                   company.status == "SUBMITTED" ? 
                   <TextField
                        onChange={(e) => {
                          editCompanyMap(company,e)
                        }}
                        margin="normal"
                        required
                        name="pkey"
                        fullWidth
                      />
                       :"****"
                 } </TableCell>
                 <TableCell align="center">  
                 {
                   company.status == "SUBMITTED" ? <Button onClick={()=>{
                    handleSubmit(company)
                   } }>Verify</Button> : company.status
                 } </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </ThemeProvider>
  );
}
