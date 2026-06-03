import io
from pdfminer.high_level import extract_text_to_fp
from pdfminer.layout import LAParams
from docx import Document

def parse_pdf(file_bytes: bytes) -> str:
    """Extract text from a PDF file."""
    output = io.StringIO()
    with io.BytesIO(file_bytes) as pdf_file:
        extract_text_to_fp(pdf_file, output, laparams=LAParams())
    text = output.getvalue()
    return text.strip()

def parse_docx(file_bytes: bytes) -> str:
    """Extract text from a DOCX file."""
    with io.BytesIO(file_bytes) as docx_file:
        doc = Document(docx_file)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
    return text.strip()

def parse_resume(file_bytes: bytes, filename: str) -> str:
    """Route to correct parser based on file type."""
    filename = filename.lower()
    if filename.endswith(".pdf"):
        return parse_pdf(file_bytes)
    elif filename.endswith(".docx"):
        return parse_docx(file_bytes)
    else:
        raise ValueError("Unsupported file type. Please upload PDF or DOCX.")