"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import MaskedTextInput from "../../../inputs/MaskedTextInput";
import SelectInput, { type Option } from "../../../inputs/SelectInput";
import TextInput from "../../../inputs/TextInput";
import GenericModal from "../../../modals/GenericModal";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import type { Address } from "..";

export type ManageAddressFormValues = Omit<Address, "id">;

interface BrazilianState {
  uf: string;
  name: string;
  cities: string[];
}

const brazilianStates: BrazilianState[] = [
  {
    uf: "AC",
    name: "Acre",
    cities: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira"],
  },
  {
    uf: "AL",
    name: "Alagoas",
    cities: ["Maceió", "Arapiraca", "União dos Palmares"],
  },
  {
    uf: "AM",
    name: "Amazonas",
    cities: ["Manaus", "Parintins", "Itacoatiara"],
  },
  {
    uf: "AP",
    name: "Amapá",
    cities: ["Macapá", "Santana", "Oiapoque"],
  },
  {
    uf: "BA",
    name: "Bahia",
    cities: ["Salvador", "Feira de Santana", "Ilhéus"],
  },
  {
    uf: "CE",
    name: "Ceará",
    cities: ["Fortaleza", "Juazeiro do Norte", "Sobral"],
  },
  {
    uf: "DF",
    name: "Distrito Federal",
    cities: ["Brasília", "Ceilândia", "Taguatinga"],
  },
  {
    uf: "ES",
    name: "Espírito Santo",
    cities: ["Vitória", "Vila Velha", "Serra"],
  },
  {
    uf: "GO",
    name: "Goiás",
    cities: ["Goiânia", "Anápolis", "Aparecida de Goiânia"],
  },
  {
    uf: "MA",
    name: "Maranhão",
    cities: ["São Luís", "Imperatriz", "Caxias"],
  },
  {
    uf: "MG",
    name: "Minas Gerais",
    cities: ["Belo Horizonte", "João Monlevade", "Uberlândia"],
  },
  {
    uf: "MS",
    name: "Mato Grosso do Sul",
    cities: ["Campo Grande", "Dourados", "Três Lagoas"],
  },
  {
    uf: "MT",
    name: "Mato Grosso",
    cities: ["Cuiabá", "Rondonópolis", "Sinop"],
  },
  {
    uf: "PA",
    name: "Pará",
    cities: ["Belém", "Ananindeua", "Santarém"],
  },
  {
    uf: "PB",
    name: "Paraíba",
    cities: ["João Pessoa", "Campina Grande", "Patos"],
  },
  {
    uf: "PE",
    name: "Pernambuco",
    cities: ["Recife", "Olinda", "Caruaru"],
  },
  {
    uf: "PI",
    name: "Piauí",
    cities: ["Teresina", "Parnaíba", "Picos"],
  },
  {
    uf: "PR",
    name: "Paraná",
    cities: ["Curitiba", "Londrina", "Maringá"],
  },
  {
    uf: "RJ",
    name: "Rio de Janeiro",
    cities: ["Rio de Janeiro", "Niterói", "Campos dos Goytacazes"],
  },
  {
    uf: "RN",
    name: "Rio Grande do Norte",
    cities: ["Natal", "Mossoró", "Parnamirim"],
  },
  {
    uf: "RO",
    name: "Rondônia",
    cities: ["Porto Velho", "Ji-Paraná", "Ariquemes"],
  },
  {
    uf: "RR",
    name: "Roraima",
    cities: ["Boa Vista", "Rorainópolis", "Caracaraí"],
  },
  {
    uf: "RS",
    name: "Rio Grande do Sul",
    cities: ["Porto Alegre", "Caxias do Sul", "Pelotas"],
  },
  {
    uf: "SC",
    name: "Santa Catarina",
    cities: ["Florianópolis", "Joinville", "Blumenau"],
  },
  {
    uf: "SE",
    name: "Sergipe",
    cities: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto"],
  },
  {
    uf: "SP",
    name: "São Paulo",
    cities: ["São Paulo", "Campinas", "Santos"],
  },
  {
    uf: "TO",
    name: "Tocantins",
    cities: ["Palmas", "Araguaína", "Gurupi"],
  },
];

interface ManageAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ManageAddressFormValues) => void;
  mode: "create" | "edit";
  initialValues?: Address | null;
}

const emptyFormValues: ManageAddressFormValues = {
  label: "",
  address: "",
  residenceNumber: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
  country: "Brasil",
};

export default function ManageAddressModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialValues,
}: ManageAddressModalProps) {
  const [formValues, setFormValues] =
    useState<ManageAddressFormValues>(emptyFormValues);

  const stateOptions = useMemo<Option[]>(
    () =>
      brazilianStates.map((state) => ({
        value: state.uf,
        label: `${state.uf} - ${state.name}`,
      })),
    []
  );

  const cityOptions = useMemo<Option[]>(() => {
    const currentState = brazilianStates.find(
      (state) => state.uf === formValues.state
    );
    if (!currentState) return [];
    return currentState.cities.map((city) => ({ value: city, label: city }));
  }, [formValues.state]);

  useEffect(() => {
    if (initialValues && isOpen) {
      setFormValues({
        label: initialValues.label,
        address: initialValues.address,
        residenceNumber: initialValues.residenceNumber,
        complement: initialValues.complement ?? "",
        neighborhood: initialValues.neighborhood,
        city: initialValues.city,
        state: initialValues.state,
        zipCode: initialValues.zipCode,
        country: initialValues.country ?? "Brasil",
      });
    } else if (isOpen) {
      setFormValues(emptyFormValues);
    }
  }, [initialValues, isOpen]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectState = (option: Option | null) => {
    setFormValues((prev) => ({
      ...prev,
      state: option?.value?.toString() ?? "",
      city: "",
    }));
  };

  const handleSelectCity = (option: Option | null) => {
    setFormValues((prev) => ({
      ...prev,
      city: option?.value?.toString() ?? "",
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  const isValid = useMemo(() => {
    return (
      formValues.label.trim() !== "" &&
      formValues.address.trim() !== "" &&
      formValues.residenceNumber.trim() !== "" &&
      formValues.neighborhood.trim() !== "" &&
      formValues.city.trim() !== "" &&
      formValues.state.trim() !== "" &&
      formValues.zipCode.trim() !== ""
    );
  }, [formValues]);

  const actionLabel =
    mode === "edit" ? "Salvar alterações" : "Cadastrar endereço";
  const title = mode === "edit" ? "Editar endereço" : "Novo endereço";

  return (
    <GenericModal
      title={title}
      open={isOpen}
      onClose={onClose}
      size="xl"
      className={clsx("max-w-3xl", "[&>div:last-child]:hidden")}
      showCancelButton={false}
      showConfirmButton={false}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          label="Identificação*"
          name="label"
          value={formValues.label}
          onChange={handleChange}
          placeholder="Casa, trabalho..."
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MaskedTextInput
            mask="00000-000"
            label="CEP*"
            name="zipCode"
            value={formValues.zipCode}
            onChange={handleChange}
            placeholder="00000-000"
            required
          />
          <TextInput
            label="Bairro*"
            name="neighborhood"
            value={formValues.neighborhood}
            onChange={handleChange}
            placeholder="Bairro"
            required
          />
        </div>

        <TextInput
          label="Logradouro*"
          name="address"
          value={formValues.address}
          onChange={handleChange}
          placeholder="Rua, avenida..."
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Número*"
            name="residenceNumber"
            value={formValues.residenceNumber}
            onChange={handleChange}
            placeholder="123"
            required
          />

          <TextInput
            label="Complemento"
            name="complement"
            value={formValues.complement}
            onChange={handleChange}
            placeholder="Apartamento, bloco..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            label="Cidade*"
            options={cityOptions}
            placeholder={
              formValues.state
                ? "Selecione sua cidade"
                : "Selecione um estado antes"
            }
            isDisabled={!formValues.state}
            onSelectOption={handleSelectCity}
            value={
              formValues.city
                ? { value: formValues.city, label: formValues.city }
                : null
            }
            isSearchable
            notFoundOptionsMessage="Cidade não encontrada."
          />
          <SelectInput
            label="UF*"
            options={stateOptions}
            placeholder="Selecione o estado"
            onSelectOption={handleSelectState}
            value={
              formValues.state
                ? stateOptions.find(
                    (option) => option.value === formValues.state
                  ) ?? null
                : null
            }
            isSearchable
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-border-card px-4 py-2 text-xs sm:text-sm font-medium text-foreground"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="inline-flex items-center justify-center rounded-md bg-primary-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {actionLabel}
          </button>
        </div>
      </form>
    </GenericModal>
  );
}

