export interface CepAddress {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  uf: string;
}

interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

/**
 * Consulta o endereço de um CEP na API pública do ViaCEP.
 *
 * Usa `fetch` direto (não o cliente `api`, que aponta para o back-end e injeta
 * autenticação). Retorna `null` quando o CEP é inválido/incompleto, inexistente
 * ou a requisição falha — cabe ao chamador manter os campos atuais nesse caso.
 */
export async function fetchAddressByCep(
  cep: string,
): Promise<CepAddress | null> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    if (!response.ok) return null;

    const data = (await response.json()) as ViaCepResponse;
    if (data.erro) return null;

    return {
      cep: data.cep ?? cep,
      street: data.logradouro ?? "",
      neighborhood: data.bairro ?? "",
      city: data.localidade ?? "",
      uf: data.uf ?? "",
    };
  } catch {
    return null;
  }
}
