import { cn } from "@/lib/utils"
import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { AuthContext } from "@/services/AuthContext";

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}) {
    const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // login retorna el perfil
      const profile = await login(username, password);

      const roles = profile.roles || [];

      // Redirección según roles
      if (roles.includes("Administrador")) {
        navigate("/admin");
      }
      else if (["Chofer", "Mecánico", "Despacho"].some(r => roles.includes(r))) {
        navigate("/empleado");
      }
      else {
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      setError("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleLogin} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Central de Herramientas</h1>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Username</FieldLabel>
          <Input
          id="username"
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        </Field>
        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
