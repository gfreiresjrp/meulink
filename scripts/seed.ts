import { db, clients, sections, links } from "../src/db";

async function main() {
  const existing = await db.select().from(clients).limit(1);
  if (existing.length) {
    console.log("Banco já tem clientes; seed ignorado.");
    return;
  }
  const clientId = "demo0000000001";
  await db.insert(clients).values({
    id: clientId,
    slug: "cliente-exemplo",
    name: "Cliente Exemplo",
    tagline: "Tudo que foi entregue na parceria, em um só lugar.",
    published: true,
  });
  const sec = (id: string, title: string, position: number) => ({ id, clientId, title, position });
  await db.insert(sections).values([
    sec("sec00000000001", "Identidade visual", 0),
    sec("sec00000000002", "Site e conteúdo", 1),
    sec("sec00000000003", "Tráfego e relatórios", 2),
  ]);
  const lk = (id: string, title: string, url: string, description: string | null, sectionId: string | null, position: number) => ({
    id, clientId, title, url, description, sectionId, position, visible: true,
  });
  await db.insert(links).values([
    lk("lnk0000000001", "Grupo no WhatsApp", "https://chat.whatsapp.com/", "Canal oficial da parceria", null, 0),
    lk("lnk0000000002", "Manual de marca", "https://drive.google.com/", "Logos, paleta e tipografia em PDF", "sec00000000001", 1),
    lk("lnk0000000003", "Arquivos da marca (SVG/PNG)", "https://drive.google.com/", null, "sec00000000001", 2),
    lk("lnk0000000004", "Site no ar", "https://alveo.com.br", null, "sec00000000002", 3),
    lk("lnk0000000005", "Calendário de conteúdo", "https://notion.so/", "Atualizado toda segunda", "sec00000000002", 4),
    lk("lnk0000000006", "Relatório mensal", "https://lookerstudio.google.com/", "Google Ads e Meta Ads", "sec00000000003", 5),
  ]);
  console.log("Seed concluído: /cliente-exemplo");
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
