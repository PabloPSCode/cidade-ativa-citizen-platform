"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import {
  PencilSimpleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import DestructiveModal from "../../modals/DestructiveModal";
import { type ManageAddressFormValues } from "./ManageAddressModal";
import ManageAddressModal from "./ManageAddressModal";

export interface Address {
  id: string;
  label: string;
  address: string;
  residenceNumber: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

interface ManageAddressesCardProps {
  addresses: Address[];
  selectedAddressId?: string;
  onSelectAddress?: (addressId: string) => void;
  onCreateAddress?: (address: ManageAddressFormValues) => void;
  onUpdateAddress?: (address: Address) => void;
  onRemoveAddress?: (addressId: string) => void;
  className?: string;
}

export default function ManageAddressesCard({
  addresses,
  className,
  selectedAddressId,
  onSelectAddress,
  onCreateAddress,
  onUpdateAddress,
  onRemoveAddress,
}: ManageAddressesCardProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<
    string | undefined
  >(selectedAddressId ?? addresses[0]?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const [addressPendingRemoval, setAddressPendingRemoval] =
    useState<Address | null>(null);

  const activeSelectedId = selectedAddressId ?? internalSelectedId;

  useEffect(() => {
    if (selectedAddressId) {
      setInternalSelectedId(selectedAddressId);
    }
  }, [selectedAddressId]);

  useEffect(() => {
    if (!addresses.length) return;
    if (!activeSelectedId) {
      setInternalSelectedId(addresses[0].id);
    }
  }, [addresses, activeSelectedId]);

  const selectedAddressLabel = useMemo(() => {
    if (!activeSelectedId) return undefined;
    return addresses.find((addr) => addr.id === activeSelectedId)?.label;
  }, [activeSelectedId, addresses]);

  const handleSelectAddress = (addressId: string) => {
    if (onSelectAddress) {
      onSelectAddress(addressId);
    }
    if (!selectedAddressId) {
      setInternalSelectedId(addressId);
    }
  };

  const handleOpenCreateModal = () => {
    setAddressToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (address: Address) => {
    setAddressToEdit(address);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAddressToEdit(null);
  };

  const handleSubmitAddress = (values: ManageAddressFormValues) => {
    if (addressToEdit && onUpdateAddress) {
      onUpdateAddress({
        ...addressToEdit,
        ...values,
      });
    } else {
      onCreateAddress?.(values);
    }
    handleCloseModal();
  };

  const handleOpenRemoveModal = (address: Address) => {
    setAddressPendingRemoval(address);
  };

  const handleConfirmRemoval = () => {
    if (addressPendingRemoval) {
      onRemoveAddress?.(addressPendingRemoval.id);
    }
    setAddressPendingRemoval(null);
  };

  const handleCancelRemoval = () => setAddressPendingRemoval(null);

  return (
    <section
      className={clsx(
        "w-full rounded-md border border-border-card bg-bg-card p-5 sm:p-6 shadow-sm text-foreground",
        "flex flex-col gap-5",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-base sm:text-lg font-semibold">
            Selecione seu endereço
          </span>
          {selectedAddressLabel && (
            <p className="text-xs sm:text-sm text-foreground/70">
              Endereço selecionado:{" "}
              <span className="font-semibold text-foreground">
                {selectedAddressLabel}
              </span>
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 text-foreground/80 text-sm sm:text-base font-semibold rounded-md px-4 py-2"
        >
          <PlusCircleIcon size={24} />
          Cadastrar novo endereço
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {addresses.length === 0 && (
          <div className="rounded-md border border-dashed border-border-card bg-background p-6 text-center text-sm text-foreground/70">
            Nenhum endereço cadastrado ainda.
          </div>
        )}

        {addresses.map((address) => {
          const isSelected = activeSelectedId === address.id;
          return (
            <div
              key={address.id}
              className={clsx(
                "rounded-lg border p-4 cursor-pointer",
                "bg-background",
                isSelected ? "border-primary-500" : "border-border-card "
              )}
            >
              <label className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex items-start gap-3 flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="selected-address"
                    className="mt-1 size-4 accent-primary-500 cursor-pointer"
                    checked={isSelected}
                    onChange={() => handleSelectAddress(address.id)}
                    aria-label={`Selecionar ${address.label}`}
                  />
                  <div className="flex flex-col gap-1 text-sm sm:text-base">
                    <span className="font-semibold text-foreground">
                      {address.label}
                    </span>
                    <span className="text-sm text-foreground">
                      {address.address}, {address.residenceNumber}
                      {address.complement ? ` - ${address.complement}` : ""}
                    </span>
                    <span className="text-xs sm:text-sm text-foreground/80">
                      {address.neighborhood} - {address.city}/{address.state}
                      {address.zipCode ? ` - CEP ${address.zipCode}` : ""}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(address)}
                    className="rounded-full border border-transparent p-2 text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    aria-label={`Editar endereço ${address.label}`}
                  >
                    <PencilSimpleIcon size={18} weight="bold" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenRemoveModal(address)}
                    className="rounded-full border border-transparent p-2 text-destructive-500   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive-500"
                    aria-label={`Remover endereço ${address.label}`}
                  >
                    <TrashIcon size={18} weight="bold" />
                  </button>
                </div>
              </label>
            </div>
          );
        })}
      </div>

      <ManageAddressModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={addressToEdit ? "edit" : "create"}
        initialValues={addressToEdit ?? undefined}
        onSubmit={handleSubmitAddress}
      />

      <DestructiveModal
        open={!!addressPendingRemoval}
        onClose={handleCancelRemoval}
        onConfirm={handleConfirmRemoval}
        title="Remover endereço"
        description={
          addressPendingRemoval
            ? `${addressPendingRemoval.address}, ${
                addressPendingRemoval.residenceNumber
              }${
                addressPendingRemoval.city
                  ? ` - ${addressPendingRemoval.city}/${addressPendingRemoval.state}`
                  : ""
              }`
            : undefined
        }
        cancelButtonLabel="Cancelar"
        confirmButtonLabel="Remover"
        confirmButtonClassName="bg-destructive-500 hover:bg-destructive-600"
        confirmMessage={
          addressPendingRemoval
            ? `Deseja remover o endereço "${addressPendingRemoval.label}"?`
            : undefined
        }
      />
    </section>
  );
}

