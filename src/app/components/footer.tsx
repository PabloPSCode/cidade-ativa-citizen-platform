"use client";
import { Footer as FooterRC } from "../../libs/react-ultimate-components";
import { useStore } from "../providers/StoreProvider";
export default function Footer() {
  const { storeData } = useStore();
  const legalItems = [
    {
      href: "#",
      label: "Política de Privacidade",
    },
    {
      href: "#",
      label: "Termos de Uso",
    },
  ];

  const supportItems = [
    storeData.store.operation.mondayToFriday && {
      label: `Seg–Sex: ${storeData.store.operation.mondayToFriday}`,
    },
    storeData.store.operation.saturday && {
      label: `Sáb: ${storeData.store.operation.saturday}`,
    },
    storeData.store.operation.sunday && {
      label: `Dom: ${storeData?.store?.operation?.sunday}`,
    },
    storeData?.contact?.phone && {
      label: `Telefone: ${storeData?.contact?.phone}`,
    },
    storeData?.contact?.email && {
      label: `Email: ${storeData?.contact?.email}`,
    },
  ].filter(Boolean) as { label: string }[];

  const deliveryItems = [
    storeData?.store?.deliveryMethods?.pickOnStore
      ? { label: "🫴🏼 Retire na loja" }
      : null,
    storeData.store.deliveryMethods.motoBoy
      ? { label: "🛵 Entrega via motoboy" }
      : null,
    storeData.store.deliveryMethods.ownVehicle
      ? { label: "🚗 Entrega via veículo próprio" }
      : null,
  ].filter(Boolean) as { label: string }[];

  const socialItems = [
    storeData?.social_medias?.instagram && {
      href: storeData.social_medias.instagram,
      iconName: "instagram",
    },
    storeData?.social_medias?.facebook && {
      href: storeData.social_medias.facebook,
      iconName: "facebook",
    },
  ].filter(Boolean) as { href: string; iconName: "instagram" | "facebook" }[];

  const cityState = [storeData?.address?.city, storeData?.address?.state]
    .filter(Boolean)
    .join(" - ");
  const addressLine = [storeData?.address?.street, cityState]
    .filter(Boolean)
    .join(", ");

  const addressText = storeData?.address?.zipCode
    ? `${addressLine} — CEP: ${storeData.address.zipCode}`
    : addressLine;

  const footerYear = new Date().getFullYear();

  return (
    <div className="bg-background text-foreground">
      <FooterRC.Root bordered>
        <FooterRC.Top columns={4}>
          <FooterRC.Column
            items={legalItems}
            title="Legal"
          />
          <FooterRC.Column
            items={supportItems}
            title="Atendimento"
          />
          <FooterRC.Column
            items={deliveryItems}
            title="Forma de entrega"
          />
        </FooterRC.Top>
        <FooterRC.SocialRow
          title="Siga-nos nas redes sociais"
          iconsClassName="text-foreground/80 hover:text-foreground"
          iconsWeight="fill"
          items={socialItems}
        />
        <FooterRC.Bottom>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <p>
                © {footerYear} {storeData?.store?.name} — CNPJ:{" "}
                {storeData?.legal?.cnpj}
              </p>
              <p className="text-foreground/70">{addressText}</p>
            </div>
            <p className="text-foreground/70 text-xs opacity-80">
              Desenvolvido por{" "}
              <a
                href="https://pablosilvadev.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-xs"
              >
                Pablo Silva Dev
              </a>
            </p>
          </div>
        </FooterRC.Bottom>
      </FooterRC.Root>
    </div>
  );
}
