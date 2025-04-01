import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/Interfaces/login';
import { Sesion } from 'src/app/Interfaces/sesion';
import { UsuariosService } from 'src/app/Services/usuarios.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formularioLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _usuarioServicio: UsuariosService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  // Método para iniciar sesión
  iniciarSesion() {
    this.mostrarLoading = true;

    const request: Login = {
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password
    };

    this._usuarioServicio.iniciarSesion(request).subscribe({
      next: (data) => {
        if (data.status) {
          // Aquí guardamos el idUsuario y los detalles del usuario en localStorage
          const usuarioSession: Sesion = data.value;  // Se asume que data.value contiene la sesión
          this._utilidadServicio.guardarSesionUsuario(data.value.idUsuario, usuarioSession);
          this.router.navigate(["pages"]);
        } else {
          this._utilidadServicio.mostrarAlerta("No se encontró el usuario", "Opps!");
        }
      },
      complete: () => {
        this.mostrarLoading = false;
      },
      error: () => {
        this._utilidadServicio.mostrarAlerta("Hubo un error al iniciar sesión", "Opps!");
      }
    });
  }
}
