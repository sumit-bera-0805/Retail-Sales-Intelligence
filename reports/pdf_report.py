from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

styles = getSampleStyleSheet()


def generate_pdf_report():
    output_file = "reports/output/Retail_Sales_Report.pdf"

    doc = SimpleDocTemplate(output_file)

    story = []

    story.append(Paragraph("<b>Retail Sales Intelligence Report</b>", styles["Title"]))

    story.append(Paragraph("Automatically Generated Report", styles["Heading2"]))

    story.append(Paragraph("Project: Retail Sales Intelligence Platform", styles["BodyText"]))

    story.append(Paragraph("Technology Stack:", styles["Heading2"]))

    story.append(Paragraph(
        "Python, PostgreSQL, SQL, FastAPI, Power BI, Prophet",
        styles["BodyText"]
    ))

    story.append(Paragraph("This report was generated automatically.", styles["BodyText"]))

    doc.build(story)

    print(f"PDF report saved: {output_file}")


if __name__ == "__main__":
    generate_pdf_report()