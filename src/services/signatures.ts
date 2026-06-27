import api from './http';

export interface SignatureResponseDTO {
  id: string;
  imageUrl: string;
  userName: string;
  userId: string;
  solicitationId: string | null;
}

export interface CreateSignatureDTO {
  imageUrl: string;
  userName: string;
  userId: string;
  /** Vincula a assinatura a uma solicitação (opcional). */
  solicitationId?: string;
}

export async function createSignature(
  data: CreateSignatureDTO,
): Promise<SignatureResponseDTO> {
  return api.post('/signatures', data);
}

export async function getSignatureById(
  id: string,
): Promise<SignatureResponseDTO> {
  return api.get(`/signatures/${id}`);
}

/**
 * Busca a assinatura de um usuário. O back-end responde 404 quando o usuário
 * ainda não possui assinatura — trate a rejeição no chamador quando necessário.
 */
export async function getSignatureByUserId(
  userId: string,
): Promise<SignatureResponseDTO> {
  return api.get(`/signatures/user/${userId}`);
}

export async function deleteSignature(id: string): Promise<void> {
  return api.delete(`/signatures/${id}`);
}

export interface SolicitationSignatureResponseDTO {
  id: string;
  imageUrl: string;
  userName: string;
  userId: string;
  solicitationId: string;
  createdAt: Date;
}

export interface SignSolicitationDTO {
  userId: string;
  solicitationId: string;
}

/**
 * Assina uma solicitação. A imagem e o nome são resolvidos no back-end a partir
 * da assinatura registrada do usuário, então só userId e solicitationId são
 * enviados. Responde 400 quando o usuário ainda não tem assinatura registrada e
 * 409 quando já assinou a solicitação.
 */
export async function signSolicitation(
  data: SignSolicitationDTO,
): Promise<SolicitationSignatureResponseDTO> {
  return api.post('/signatures/solicitation', data);
}

export async function listSignaturesBySolicitation(
  solicitationId: string,
): Promise<SolicitationSignatureResponseDTO[]> {
  return api.get(`/signatures/solicitation/${solicitationId}`);
}
