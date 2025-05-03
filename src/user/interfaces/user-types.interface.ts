import { AccountType } from '../user.model';

// Interfaz base con campos comunes
export interface BaseUserData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

// Interfaz para tiendas
export interface StoreUserData extends BaseUserData {
  store_name: string;
  store_address: string;
  store_phone: string;
}

// Interfaz para clientes/usuarios normales
export interface CustomerUserData extends BaseUserData {
  address: string;
}

// Interfaz para repartidores
export interface DeliveryUserData extends BaseUserData {
  // No tiene campos adicionales específicos
}

// Interfaz para administradores
export interface AdminUserData extends BaseUserData {
  // Campos específicos para administradores si los hubiera
}

// Tipo unión para cualquier tipo de usuario
export type UserData = StoreUserData | CustomerUserData | DeliveryUserData | AdminUserData;

// Función para determinar el tipo de usuario basado en los campos proporcionados
export function determineUserType(userData: any): AccountType {
  // Si tiene los tres campos específicos de tienda, es una tienda
  if (userData.store_name && userData.store_address && userData.store_phone) {
    return AccountType.TIENDA;
  }

  // Si tiene dirección, es un cliente normal
  if (userData.address) {
    return AccountType.USUARIO;
  }

  // Si solo tiene los campos básicos (nombre, email, teléfono) sin dirección ni campos de tienda, es un repartidor
  if (userData.name && userData.email && userData.phone &&
      !userData.address && !userData.store_name && !userData.store_address && !userData.store_phone) {
    return AccountType.DELIVERY;
  }

  // Por defecto, asumimos que es un usuario normal
  return AccountType.USUARIO;
}
