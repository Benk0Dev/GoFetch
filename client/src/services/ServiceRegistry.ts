import { IService } from "@gofetch/models/IService";

import { API_URL } from "@client/services/Registry";

export async function addService(userId: number, service: IService) {
  try {
    const response = await fetch(`${API_URL}/newservice/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(service)
    });
    if (response.ok) {
      return true;
    } else {
      const text = await response.text();
      console.error(text);
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function editService(serviceId: number, service: IService) {
  try {
    const response = await fetch(`${API_URL}/editservice/${serviceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(service)
    });
    if (response.ok) {
      return true;
    } else {
      const text = await response.text();
      console.error(text);
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
}
export async function deleteService(serviceId: number) {
  try {
    const response = await fetch(`${API_URL}/deleteservice/${serviceId}`, {
      method: "DELETE"
    });
    if (response.ok) {
      return true;
    } else {
      const text = await response.text();
      console.error(text);
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function getAllServices() {
  try {
    const response = await fetch(`${API_URL}/services`);
    if (response.ok) {
      const services = await response.json();
      return services;
    } else {
      const text = await response.text();
      console.error(text);
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getServiceById(serviceId: number) {
  try {
    const response = await fetch(`${API_URL}/service/${serviceId}`);
    if (response.ok) {
      const service = await response.json();
      return service;
    } else {
      const text = await response.text();
      console.error(text);
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}