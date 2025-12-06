import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LockIcon from "@mui/icons-material/Lock";
import image from "../assets/result.svg";
import { Link, useNavigate } from "react-router-dom"; // useNavigate eklendi!
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { Formik, Form } from "formik";
import { object, string } from "yup";
import useApiRequest from "../services/useApiRequest";

const Login = () => {
  // 1. useNavigate hook'unu tanımlayın
  const navigate = useNavigate();
  const { login } = useApiRequest();

  // ... (loginSchema kısmı aynı kalır)
  const loginSchema = object({
    email: string()
      .email("Geçerli bir email giriniz")
      .required("Email zorunludur"),
    password: string()
      .required("Şifre zorunludur")
      .min(8, "Şifre en az 8 karakter olmalıdır")
      .max(16, "Şifre en fazla 16 karakter olmalıdır")
      .matches(/\d+/, "Şifre en az bir rakam içermelidir.")
      .matches(/[a-z]+/, "Şifre en az bir küçük harf içermelidir.")
      .matches(/[A-Z]+/, "Şifre en az bir büyük harf içermelidir.")
      .matches(
        /[@$!%*?&]+/,
        "Şifre en az bir özel karakter(@$!%*?&) içermelidir."
      ),
  })

  return (
    <Container maxWidth="lg">
      <Grid
        container
        justifyContent="center"
        direction="row-reverse"
        sx={{
          height: "100vh",
          p: 2,
        }}
      >
        {/* ... (Diğer JSX Kodları aynı kalır) ... */}
        
        <Grid item xs={12} sm={10} md={6}>
          {/* ... (Avatar ve Typography aynı kalır) ... */}
          
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={(values, actions) => {
              // 2. login fonksiyonunu navigate ile çağırın
              // login fonksiyonunuzun Promise döndürdüğünü veya
              // bir callback'i kabul ettiğini varsayıyoruz.
              
              // En temiz yol: login içinde navigate yapmak
              // Ancak, Login component'i içinde kalmak için:
              
              login(values, navigate); // navigate fonksiyonunu login'e gönderin
              
              actions.resetForm();
              actions.setSubmitting(false);
            }}
          >
            {({
              values,
              handleChange,
              handleBlur,
              touched,
              errors,
              isSubmitting,
            }) => (
              <Form>
                {/* ... (Form Elemanları aynı kalır) ... */}
                
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Email"
                    name="email"
                    id="email"
                    type="email"
                    variant="outlined"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    label="password"
                    name="password"
                    id="password"
                    type="password"
                    variant="outlined"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Link to="/register">Do you have not an account?</Link>
          </Box>
        </Grid>
        
        {/* ... (Resim Grid'i aynı kalır) ... */}
        
      </Grid>
    </Container>
  );
};

export default Login;