import os

class SimplePDFBuilder:
    def __init__(self):
        self.pages = []
        # Page dimensions: Landscape A4 (842 x 595 points)
        self.width = 842
        self.height = 595

    def add_page_stream(self, stream_content):
        self.pages.append(stream_content)

    def generate(self, filename):
        objects = []

        # Object 1: Catalog
        objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")

        # Object 2: Pages placeholder (will update kids)
        # We will build page objects starting from Object 3
        # Page i will be Object 3 + (i*2), Content i will be Object 4 + (i*2)

        page_obj_ids = []
        for i in range(len(self.pages)):
            page_id = 3 + i * 2
            page_obj_ids.append(f"{page_id} 0 R")

        pages_obj = f"<< /Type /Pages /Kids [{' '.join(page_obj_ids)}] /Count {len(self.pages)} >>".encode('latin1')
        objects.append(pages_obj)

        # Object 3 onwards: Page & Content objects
        font_obj_id = 3 + len(self.pages) * 2

        for i, stream_text in enumerate(self.pages):
            page_id = 3 + i * 2
            content_id = 4 + i * 2

            page_obj = f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {self.width} {self.height}] /Contents {content_id} 0 R /Resources << /Font << /F1 {font_obj_id} 0 R /F2 {font_obj_id+1} 0 R >> >> >>".encode('latin1')
            objects.append(page_obj)

            stream_bytes = stream_text.encode('latin1')
            content_obj = f"<< /Length {len(stream_bytes)} >>\nstream\n".encode('latin1') + stream_bytes + b"\nendstream"
            objects.append(content_obj)

        # Font objects: F1 = Helvetica-Bold, F2 = Helvetica
        objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")
        objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")

        # Now compile PDF binary
        pdf_buf = bytearray()
        pdf_buf.extend(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")

        offsets = []
        for i, obj in enumerate(objects):
            offsets.append(len(pdf_buf))
            obj_num = i + 1
            pdf_buf.extend(f"{obj_num} 0 obj\n".encode('latin1'))
            pdf_buf.extend(obj)
            pdf_buf.extend(b"\nendobj\n")

        start_xref = len(pdf_buf)
        pdf_buf.extend(f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode('latin1'))
        for off in offsets:
            pdf_buf.extend(f"{off:010d} 00000 n \n".encode('latin1'))

        trailer = f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{start_xref}\n%%EOF\n".encode('latin1')
        pdf_buf.extend(trailer)

        with open(filename, 'wb') as f:
            f.write(pdf_buf)

def escape_pdf(text):
    return text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

def draw_header(title, subtitle):
    # Header bar background
    s = "0.03 0.05 0.08 rg\n0 535 842 60 re f\n"
    # Accent green line
    s += "0.06 0.78 0.54 RG\n3 w\n0 535 m 842 535 l S\n"
    # Logo text CENTRY
    s += "BT /F1 18 Tf 1.0 1.0 1.0 rg 30 558 TD (CENTRY) Tj ET\n"
    s += "BT /F2 10 Tf 0.06 0.78 0.54 rg 115 561 TD (ENERGIA & TECNOLOGIA | SOLUCOES BESS) Tj ET\n"
    # Title & Subtitle right side
    s += f"BT /F1 14 Tf 1.0 1.0 1.0 rg 450 560 TD ({escape_pdf(title)}) Tj ET\n"
    s += f"BT /F2 9 Tf 0.6 0.7 0.8 rg 450 545 TD ({escape_pdf(subtitle)}) Tj ET\n"
    return s

def draw_footer(page_num, total_pages):
    s = "0.03 0.05 0.08 rg\n0 0 842 30 re f\n"
    s += "0.15 0.2 0.25 RG\n1 w\n0 30 m 842 30 l S\n"
    s += "BT /F2 8 Tf 0.5 0.6 0.7 rg 30 11 TD (CENTRY Energia & Tecnologia - Proposta Comercial e Tecnica BESS 2026) Tj ET\n"
    s += f"BT /F1 8 Tf 0.06 0.78 0.54 rg 760 11 TD (Pagina {page_num} de {total_pages}) Tj ET\n"
    return s

builder = SimplePDFBuilder()

# ---------------------------------------------------------
# PAGE 1: RESUMO EXEC
# ---------------------------------------------------------
p1 = "0.04 0.07 0.11 rg\n0 0 842 595 re f\n"
p1 += draw_header("RESUMO EXECUTIVO", "Apresentacao Comercial BESS")

# Hero Title Box
p1 += "0.06 0.1 0.16 rg\n30 400 782 115 re f\n"
p1 += "0.06 0.78 0.54 RG\n2 w\n30 400 782 115 re S\n"
p1 += "BT /F1 22 Tf 1.0 1.0 1.0 rg 50 480 TD (Sistemas de Armazenamento de Energia em Baterias (BESS)) Tj ET\n"
p1 += "BT /F2 12 Tf 0.8 0.9 0.95 rg 50 455 TD (Substitua ou complemente geradores a diesel com tecnologia LFP de alta performance.) Tj ET\n"
p1 += "BT /F2 11 Tf 0.06 0.78 0.54 rg 50 425 TD (Reducao de custos na ponta (Peak Shaving) | Backup instantaneo <10ms | Zero Emissoes ESG) Tj ET\n"

# 3 Pillar Cards
pillars = [
    ("ECONOMIA FINANCEIRA", "Corte de custos drastico na Tarifa de Ponta (horario caro). Economia diaria automatica com arbitragem tarifaria.", 30, 240, 245, 145),
    ("SEGURANCA E CONTINUIDADE", "Tempo de resposta em milissegundos (<10ms). Protecao total contra apagoes sem pausa em processos criticos.", 298, 240, 245, 145),
    ("SOSTENIBILIDADE & ESG", "Zero emissao de CO2 ou fumaca. Operacao 100% silenciosa e limpa para conformidade ambiental corporativa.", 566, 240, 245, 145)
]

for title, desc, x, y, w, h in pillars:
    p1 += f"{0.07} {0.12} {0.18} rg\n{x} {y} {w} {h} re f\n"
    p1 += f"0.15 0.22 0.3 RG\n1 w\n{x} {y} {w} {h} re S\n"
    p1 += f"BT /F1 12 Tf 0.06 0.78 0.54 rg {x+15} {y+115} TD ({title}) Tj ET\n"

    # Split text into 2 lines
    words = desc.split()
    l1 = " ".join(words[:7])
    l2 = " ".join(words[7:])
    p1 += f"BT /F2 10 Tf 0.8 0.85 0.9 rg {x+15} {y+80} TD ({l1}) Tj ET\n"
    p1 += f"BT /F2 10 Tf 0.8 0.85 0.9 rg {x+15} {y+60} TD ({l2}) Tj ET\n"

# KPI Metrics Bar
p1 += "0.06 0.1 0.16 rg\n30 50 782 170 re f\n"
p1 += "0.15 0.22 0.3 RG\n1 w\n30 50 782 170 re S\n"
p1 += "BT /F1 13 Tf 1.0 1.0 1.0 rg 50 190 TD (INDICADORES CHAVE DE DESEMPENHO (KPIs)) Tj ET\n"

kpis = [
    ("< 10 ms", "Tempo de Resposta Nobreak", 60),
    ("15+ Anos", "Vida Util (6.000+ Ciclos)", 250),
    ("0 kg/h", "Emissoes de Carbono", 450),
    ("Ate 65%", "Reducao OPEX Tarifa Ponta", 640)
]
for val, lbl, x in kpis:
    p1 += f"BT /F1 20 Tf 0.06 0.78 0.54 rg {x} {y-100} TD ({val}) Tj ET\n"
    p1 += f"BT /F2 10 Tf 0.7 0.8 0.85 rg {x} {y-120} TD ({lbl}) Tj ET\n"

p1 += draw_footer(1, 5)
builder.add_page_stream(p1)

# ---------------------------------------------------------
# PAGE 2: COMO FUNCIONA
# ---------------------------------------------------------
p2 = "0.04 0.07 0.11 rg\n0 0 842 595 re f\n"
p2 += draw_header("COMO FUNCIONA", "Arquitetura Eletromecanica BESS")

# Operating Modes Title
p2 += "BT /F1 16 Tf 1.0 1.0 1.0 rg 30 495 TD (MODOS DE OPERACAO SIMULTANEA CENTRY BESS) Tj ET\n"

modes = [
    ("1. Peak Shaving (Corte de Demanda)", "Injeta energia armazenada nos momentos de pico de consumo, evitando cobrança de ultrapassagem de demanda contratada.", 30, 360, 375, 115),
    ("2. Arbitragem de Tarifa", "Carrega as baterias no horario Fora-Ponta (tarifa barata) e descarrega no horario de Ponta (tarifa cara), gerando lucro diario.", 437, 360, 375, 115),
    ("3. Nobreak & Backup Instantaneo", "Em apagoes da concessionaria, assume as cargas criticas em menos de 10ms sem desligar maquinas ou servidores.", 30, 225, 375, 115),
    ("4. Suporte a Redes & Solar", "Estabiliza o fator de potencia, reduz oscilacoes de tensao e armazena o excedente de geracao solar fotovoltaica.", 437, 225, 375, 115)
]

for title, desc, x, y, w, h in modes:
    p2 += f"0.07 0.12 0.18 rg\n{x} {y} {w} {h} re f\n"
    p2 += f"0.15 0.25 0.35 RG\n1 w\n{x} {y} {w} {h} re S\n"
    p2 += f"BT /F1 12 Tf 0.06 0.78 0.54 rg {x+15} {y+85} TD ({escape_pdf(title)}) Tj ET\n"

    words = desc.split()
    l1 = " ".join(words[:8])
    l2 = " ".join(words[8:])
    p2 += f"BT /F2 10 Tf 0.85 0.9 0.95 rg {x+15} {y+55} TD ({escape_pdf(l1)}) Tj ET\n"
    p2 += f"BT /F2 10 Tf 0.85 0.9 0.95 rg {x+15} {y+38} TD ({escape_pdf(l2)}) Tj ET\n"

# Architecture Diagram Box
p2 += "0.06 0.1 0.16 rg\n30 50 782 155 re f\n"
p2 += "0.06 0.78 0.54 RG\n1.5 w\n30 50 782 155 re S\n"
p2 += "BT /F1 13 Tf 1.0 1.0 1.0 rg 50 175 TD (FLUXO INTEGRADO DE ENERGIA & INTELIGENCIA (CENTRY EMS)) Tj ET\n"

steps = [
    ("Fontes de Entrada", "Rede Concessionaria / Solar", 60),
    ("PCS Inverter", "Conversao AC/DC Bidirecional", 250),
    ("Baterias LiFePO4", "Armazenamento Seguro LFP", 440),
    ("CENTRY EMS AI", "Algoritmo Preditivo Cloud", 630)
]

for st, sd, x in steps:
    p2 += f"0.08 0.15 0.22 rg\n{x} 70 145 80 re f\n"
    p2 += f"0.15 0.3 0.4 RG\n1 w\n{x} 70 145 80 re S\n"
    p2 += f"BT /F1 11 Tf 0.06 0.78 0.54 rg {x+10} 125 TD ({st}) Tj ET\n"
    p2 += f"BT /F2 8.5 Tf 0.8 0.85 0.9 rg {x+10} 100 TD ({sd}) Tj ET\n"

p2 += draw_footer(2, 5)
builder.add_page_stream(p2)

# ---------------------------------------------------------
# PAGE 3: MATRIZ COMPARATIVA (BESS VS DIESEL)
# ---------------------------------------------------------
p3 = "0.04 0.07 0.11 rg\n0 0 842 595 re f\n"
p3 += draw_header("COMPARATIVO TECNICO", "BESS CENTRY vs Gerador a Diesel")

p3 += "BT /F1 16 Tf 1.0 1.0 1.0 rg 30 495 TD (MATRIZ COMPARATIVA DE TECNOLOGIA E OPERACAO) Tj ET\n"

# Table Header
p3 += "0.08 0.14 0.2 rg\n30 445 782 35 re f\n"
p3 += "BT /F1 11 Tf 1.0 1.0 1.0 rg 45 458 TD (CRITERIO DE AVALIACAO) Tj ET\n"
p3 += "BT /F1 11 Tf 0.06 0.78 0.54 rg 300 458 TD (CENTRY BESS (BATERIAS LFP)) Tj ET\n"
p3 += "BT /F1 11 Tf 0.95 0.35 0.35 rg 560 458 TD (GERADOR A DIESEL TRADICIONAL) Tj ET\n"

rows = [
    ("Tempo de Resposta", "< 10 milissegundos (Instantaneo / UPS)", "10 a 15 segundos (Pausa nas maquinas)"),
    ("Geracao de Receita", "SIM - Opera diariamente em Arbitragem & Peak", "NAO - Apenas centro de custo / despesa"),
    ("Ruido & Poluicao", "Silencioso (< 55 dB - apito leve)", "Ruidoso (85 a 105 dB - exige atenuacao)"),
    ("Emissoes Carbono (ESG)", "Zero emissioes locais (100% limpo)", "Alta emissao CO2, fumaca e fuligem"),
    ("Custos Manutencao (OPEX)", "Quase Zero (< 0.5%/ano - sem troca oleo)", "Elevado (combustivel caro, oleo, filtros)"),
    ("Licenciamento Ambiental", "Simplificado (sem tanque combustivel)", "Complexo (exige bacia de contencao)")
]

y_pos = 405
for i, (crit, bess, gen) in enumerate(rows):
    bg = "0.06 0.1 0.15" if i % 2 == 0 else "0.04 0.07 0.12"
    p3 += f"{bg} rg\n30 {y_pos} 782 38 re f\n"
    p3 += f"0.12 0.18 0.25 RG\n1 w\n30 {y_pos} 782 38 re S\n"

    p3 += f"BT /F1 10 Tf 1.0 1.0 1.0 rg 45 {y_pos+13} TD ({escape_pdf(crit)}) Tj ET\n"
    p3 += f"BT /F2 9.5 Tf 0.06 0.78 0.54 rg 300 {y_pos+13} TD ({escape_pdf(bess)}) Tj ET\n"
    p3 += f"BT /F2 9.5 Tf 0.9 0.6 0.6 rg 560 {y_pos+13} TD ({escape_pdf(gen)}) Tj ET\n"
    y_pos -= 42

# Hybrid Solution Box
p3 += "0.06 0.14 0.18 rg\n30 60 782 85 re f\n"
p3 += "0.06 0.78 0.54 RG\n1.5 w\n30 60 782 85 re S\n"
p3 += "BT /F1 12 Tf 0.06 0.78 0.54 rg 50 120 TD (SOLUCAO HIBRIDA INTELIGENTE: BESS + GERADOR EXISTENTE) Tj ET\n"
p3 += "BT /F2 10 Tf 0.85 0.9 0.95 rg 50 95 TD (Se a sua empresa ja possui geradores a diesel, o BESS CENTRY pode ser integrado em paralelo.) Tj ET\n"
p3 += "BT /F2 10 Tf 0.85 0.9 0.95 rg 50 78 TD (O BESS assume os cortes diarios de pico e a resposta instantanea, reduzindo o uso do gerador em ate 90%.) Tj ET\n"

p3 += draw_footer(3, 5)
builder.add_page_stream(p3)

# ---------------------------------------------------------
# PAGE 4: ESTUDO FINANCEIRO & ROI
# ---------------------------------------------------------
p4 = "0.04 0.07 0.11 rg\n0 0 842 595 re f\n"
p4 += draw_header("ESTUDO FINANCEIRO", "Analise de Retorno do Investimento (ROI)")

p4 += "BT /F1 16 Tf 1.0 1.0 1.0 rg 30 495 TD (EXEMPLO DE VIABILIDADE FINANCEIRA (PROJETO CENTRY 500 kW / 1000 kWh)) Tj ET\n"

# Financial Cards
fin_cards = [
    ("Economia Anual Estimada", "R$ 680.000 / ano", "Arbitragem tarifaria no Horario de Ponta (3h/dia) + despesas evitadas em diesel.", 30, 360, 375, 115),
    ("Payback do Investimento", "3,8 Anos", "Retorno completo do CAPEX liquido considerado em projeto turnkey entregue.", 437, 360, 375, 115)
]

for title, main_val, sub, x, y, w, h in fin_cards:
    p4 += f"0.07 0.12 0.18 rg\n{x} {y} {w} {h} re f\n"
    p4 += f"0.06 0.78 0.54 RG\n1.5 w\n{x} {y} {w} {h} re S\n"
    p4 += f"BT /F1 11 Tf 0.7 0.8 0.9 rg {x+15} {y+88} TD ({escape_pdf(title)}) Tj ET\n"
    p4 += f"BT /F1 22 Tf 0.06 0.78 0.54 rg {x+15} {y+55} TD ({escape_pdf(main_val)}) Tj ET\n"

    words = sub.split()
    l1 = " ".join(words[:8])
    l2 = " ".join(words[8:])
    p4 += f"BT /F2 9 Tf 0.8 0.85 0.9 rg {x+15} {y+32} TD ({escape_pdf(l1)}) Tj ET\n"
    p4 += f"BT /F2 9 Tf 0.8 0.85 0.9 rg {x+15} {y+18} TD ({escape_pdf(l2)}) Tj ET\n"

# 10 Year Cashflow Table
p4 += "0.06 0.1 0.16 rg\n30 60 782 270 re f\n"
p4 += "0.15 0.22 0.3 RG\n1 w\n30 60 782 270 re S\n"
p4 += "BT /F1 13 Tf 1.0 1.0 1.0 rg 50 305 TD (PROJECAO DE FLUXO DE CAIXA ACUMULADO (10 ANOS)) Tj ET\n"

# Sub-table headers
p4 += "0.08 0.15 0.22 rg\n50 265 742 28 re f\n"
p4 += "BT /F1 10 Tf 1.0 1.0 1.0 rg 70 274 TD (ANO) Tj ET\n"
p4 += "BT /F1 10 Tf 1.0 1.0 1.0 rg 200 274 TD (ECONOMIA ACUMULADA) Tj ET\n"
p4 += "BT /F1 10 Tf 1.0 1.0 1.0 rg 450 274 TD (RETORNO LIQUIDO (LUCRO ACUMULADO)) Tj ET\n"

cf_rows = [
    ("Ano 1", "R$ 680.000", "Amortizando CAPEX inicial..."),
    ("Ano 3", "R$ 2.040.000", "Fase final de amortizacao"),
    ("Ano 5 (Pos-Payback)", "R$ 3.400.000", "+ R$ 1.100.000 LUCRO LIQUIDO ACUMULADO"),
    ("Ano 8", "R$ 5.440.000", "+ R$ 3.140.000 LUCRO LIQUIDO ACUMULADO"),
    ("Ano 10", "R$ 6.800.000", "+ R$ 4.500.000 LUCRO LIQUIDO ACUMULADO")
]

y_pos = 230
for yr, eco, net in cf_rows:
    p4 += f"0.05 0.08 0.13 rg\n50 {y_pos} 742 30 re f\n"
    p4 += f"0.1 0.15 0.2 RG\n1 w\n50 {y_pos} 742 30 re S\n"
    p4 += f"BT /F1 10 Tf 1.0 1.0 1.0 rg 70 {y_pos+10} TD ({yr}) Tj ET\n"
    p4 += f"BT /F2 10 Tf 0.8 0.9 0.95 rg 200 {y_pos+10} TD ({eco}) Tj ET\n"
    p4 += f"BT /F1 10 Tf 0.06 0.78 0.54 rg 450 {y_pos+10} TD ({net}) Tj ET\n"
    y_pos -= 34

p4 += draw_footer(4, 5)
builder.add_page_stream(p4)

# ---------------------------------------------------------
# PAGE 5: ESPECIFICACOES TECNICAS & EQUIPAMENTOS
# ---------------------------------------------------------
p5 = "0.04 0.07 0.11 rg\n0 0 842 595 re f\n"
p5 += draw_header("EQUIPAMENTOS", "Ficha Tecnica dos Sistemas CENTRY")

p5 += "BT /F1 16 Tf 1.0 1.0 1.0 rg 30 495 TD (PORTFOLIO DE SISTEMAS DE ARMAZENAMENTO BESS) Tj ET\n"

eqs = [
    ("CENTRY ESS-250", "Comercio & Servicos", "250 kWh", "125 kW", "380V/440V Trifasico", "IP65 / NEMA 4X", 30, 240, 245, 230),
    ("CENTRY ESS-1000", "Container Industrial 20ft", "1.000 kWh (1 MWh)", "500 a 1.000 kW", "Liquid Dual-Loop", "Novec 1230 Fire", 298, 240, 245, 230),
    ("CENTRY ESS-MEGA", "Usinas & Concessionarias", "2.5 MWh a 10 MWh+", "Container 40ft HC", "IEC 61850 Protocol", "NFPA 855 / UL9540A", 566, 240, 245, 230)
]

for name, cat, cap, pot, ref, prot, x, y, w, h in eqs:
    p5 += f"0.07 0.12 0.18 rg\n{x} {y} {w} {h} re f\n"
    p5 += f"0.06 0.78 0.54 RG\n1.5 w\n{x} {y} {w} {h} re S\n"
    p5 += f"BT /F1 13 Tf 1.0 1.0 1.0 rg {x+15} {y+198} TD ({name}) Tj ET\n"
    p5 += f"BT /F2 9.5 Tf 0.06 0.78 0.54 rg {x+15} {y+180} TD ({cat}) Tj ET\n"

    specs = [
        ("Capacidade:", cap),
        ("Potencia:", pot),
        ("Sistema/Tensao:", ref),
        ("Protecao/Norma:", prot)
    ]

    sy = y + 140
    for lbl, val in specs:
        p5 += f"BT /F2 9 Tf 0.6 0.7 0.8 rg {x+15} {sy} TD ({lbl}) Tj ET\n"
        p5 += f"BT /F1 9.5 Tf 1.0 1.0 1.0 rg {x+15} {sy-14} TD ({val}) Tj ET\n"
        sy -= 34

# Safety Certifications Box
p5 += "0.06 0.1 0.16 rg\n30 60 782 150 re f\n"
p5 += "0.15 0.22 0.3 RG\n1 w\n30 60 782 150 re S\n"
p5 += "BT /F1 13 Tf 1.0 1.0 1.0 rg 50 180 TD (CERTIFICACOES INTERNACIONAIS DE SEGURANCA E QUALIDADE) Tj ET\n"

certs = [
    ("UL 9540 & UL 9540A", "Certificacao de seguranca contra propagacao termica de celulas LFP."),
    ("NFPA 855 Compliant", "Norma internacional para instalacao segura de sistemas fixos de energia."),
    ("IEC 62619 & UN 38.3", "Garantia internacional para transporte e operacao industrial de baterias.")
]

cx = 50
for ctitle, cdesc in certs:
    p5 += f"BT /F1 10.5 Tf 0.06 0.78 0.54 rg {cx} 145 TD ({ctitle}) Tj ET\n"
    words = cdesc.split()
    l1 = " ".join(words[:6])
    l2 = " ".join(words[6:])
    p5 += f"BT /F2 9 Tf 0.8 0.85 0.9 rg {cx} 125 TD ({l1}) Tj ET\n"
    p5 += f"BT /F2 9 Tf 0.8 0.85 0.9 rg {cx} 110 TD ({l2}) Tj ET\n"
    cx += 250

p5 += draw_footer(5, 5)
builder.add_page_stream(p5)

# Save PDF to disk
output_path = os.path.abspath("CENTRY_BESS_Apresentacao.pdf")
builder.generate(output_path)
print("PDF generated successfully at:", output_path)
