from pathlib import Path
from copy import deepcopy
from xml.sax.saxutils import escape

from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Preformatted,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = ROOT / "output" / "pdf"
OUTPUT_PDF = OUTPUT_DIR / "FSD_Practical_06_to_11_Source_Code.pdf"

ARIAL = Path(r"C:\Windows\Fonts\arial.ttf")
ARIAL_BOLD = Path(r"C:\Windows\Fonts\arialbd.ttf")
SYMBOL_FONT = Path(r"C:\Windows\Fonts\seguisym.ttf")
ARIAL_CODEPOINTS = set()

PRACTICALS = [
    {
        "number": 6,
        "question": "6. Develop an event management App. The App should suggest venues as per event and size of crowd.",
        "files": [
            "06_Practical/server.js",
            "06_Practical/venues.js",
            "06_Practical/public/index.html",
            "06_Practical/public/style.css",
            "06_Practical/public/app.js",
        ],
    },
    {
        "number": 7,
        "question": "7. Develop backend as required. Also consider location. Prepare project for company meeting, birthday celebration, music concert.",
        "files": [
            "07_Practical/server.js",
            "07_Practical/venues.js",
            "07_Practical/public/index.html",
            "07_Practical/public/style.css",
            "07_Practical/public/app.js",
        ],
    },
    {
        "number": 8,
        "question": "8. Build a robust Todo List App with ReactJS",
        "files": [
            "08_Practical/src/main.jsx",
            "08_Practical/src/App.jsx",
            "08_Practical/src/components/TodoForm.jsx",
            "08_Practical/src/components/TodoItem.jsx",
            "08_Practical/src/components/TodoList.jsx",
            "08_Practical/src/App.css",
        ],
    },
    {
        "number": 9,
        "question": "9. Write a program to create a voting application using React JS",
        "files": [
            "09_Practical/src/main.jsx",
            "09_Practical/src/App.jsx",
            "09_Practical/src/components/CandidateCard.jsx",
            "09_Practical/src/components/VotingPanel.jsx",
            "09_Practical/src/components/ResultsPanel.jsx",
            "09_Practical/src/App.css",
        ],
    },
    {
        "number": 10,
        "question": "10. Develop a travel log App. In which user can view/share travel experiences.",
        "files": [
            "10_Practical/server.js",
            "10_Practical/config/db.js",
            "10_Practical/models/Travel.js",
            "10_Practical/controllers/travelController.js",
            "10_Practical/routes/travelRoutes.js",
            "10_Practical/public/index.html",
            "10_Practical/public/add-travel.html",
            "10_Practical/public/edit-travel.html",
            "10_Practical/public/css/style.css",
            "10_Practical/public/js/app.js",
            "10_Practical/public/js/add-travel.js",
            "10_Practical/public/js/edit-travel.js",
        ],
    },
    {
        "number": 11,
        "question": "11. Develop an app that recommends the food as per nutrition requirements.",
        "files": [
            "11_Practical/server.js",
            "11_Practical/foods.js",
            "11_Practical/public/index.html",
            "11_Practical/public/style.css",
            "11_Practical/public/app.js",
        ],
    },
]


def read_source(relative_path: str) -> str:
    path = ROOT / relative_path
    return path.read_text(encoding="utf-8-sig").replace("\r\n", "\n").replace("\r", "\n")


def code_string_width(text: str, font_size: float) -> float:
    return sum(
        pdfmetrics.stringWidth(char, "Arial" if ord(char) in ARIAL_CODEPOINTS else "SegoeUISymbol", font_size)
        for char in text
    )


def wrap_code(text: str, width_points: float, font_name: str, font_size: float) -> str:
    """Wrap only lines wider than the printable area, with continuation indentation."""
    output = []
    for original in text.expandtabs(2).split("\n"):
        remaining = original
        first = True
        base_indent = original[: len(original) - len(original.lstrip(" "))]
        while code_string_width(remaining, font_size) > width_points:
            prefix = "" if first else base_indent + "    "
            usable = width_points - code_string_width(prefix, font_size)
            low, high = 1, len(remaining)
            while low < high:
                mid = (low + high + 1) // 2
                if code_string_width(remaining[:mid], font_size) <= usable:
                    low = mid
                else:
                    high = mid - 1
            cut = max(1, low)
            search_start = max(1, cut - 28)
            preferred = max(
                remaining.rfind(" ", search_start, cut + 1),
                remaining.rfind(",", search_start, cut + 1),
                remaining.rfind(";", search_start, cut + 1),
            )
            if preferred > 0:
                cut = preferred + (0 if remaining[preferred] == " " else 1)
            piece = remaining[:cut].rstrip()
            output.append(prefix + piece)
            remaining = remaining[cut:]
            if remaining.startswith(" "):
                remaining = remaining[1:]
            first = False
        prefix = "" if first else base_indent + "    "
        output.append(prefix + remaining)
    return "\n".join(output)


class HybridPreformatted(Preformatted):
    """Arial code text with a symbol-font fallback for missing Unicode glyphs."""

    def split(self, availWidth, availHeight):
        if availHeight < self.style.leading:
            return []
        lines_that_fit = int(availHeight / self.style.leading)
        text1 = "\n".join(self.lines[:lines_that_fit])
        text2 = "\n".join(self.lines[lines_that_fit:])
        style = self.style
        if style.firstLineIndent != 0:
            style = deepcopy(style)
            style.firstLineIndent = 0
        return [HybridPreformatted(text1, self.style), HybridPreformatted(text2, style)]

    def draw(self):
        style = self.style
        y = self.height - style.fontSize
        self.canv.setFillColor(style.textColor)
        for line in self.lines:
            x = style.leftIndent
            if line:
                run_font = "Arial" if ord(line[0]) in ARIAL_CODEPOINTS else "SegoeUISymbol"
                run = []
                for char in line:
                    char_font = "Arial" if ord(char) in ARIAL_CODEPOINTS else "SegoeUISymbol"
                    if char_font != run_font:
                        text = "".join(run)
                        self.canv.setFont(run_font, style.fontSize)
                        self.canv.drawString(x, y, text)
                        x += pdfmetrics.stringWidth(text, run_font, style.fontSize)
                        run = []
                        run_font = char_font
                    run.append(char)
                text = "".join(run)
                self.canv.setFont(run_font, style.fontSize)
                self.canv.drawString(x, y, text)
            y -= style.leading


class NumberedCanvasMixin:
    @staticmethod
    def draw_page_number(canvas, doc):
        canvas.saveState()
        canvas.setFont("Arial", 7)
        canvas.setFillColorRGB(0, 0, 0)
        canvas.drawCentredString(LETTER[0] / 2, 17, str(doc.page))
        canvas.restoreState()


def build_pdf() -> None:
    global ARIAL_CODEPOINTS
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    arial_font = TTFont("Arial", str(ARIAL))
    pdfmetrics.registerFont(arial_font)
    pdfmetrics.registerFont(TTFont("Arial-Bold", str(ARIAL_BOLD)))
    pdfmetrics.registerFont(TTFont("SegoeUISymbol", str(SYMBOL_FONT)))
    ARIAL_CODEPOINTS = set(arial_font.face.charToGlyph)

    margin = 0.5 * inch
    footer_gap = 10
    frame = Frame(
        margin,
        margin + footer_gap,
        LETTER[0] - 2 * margin,
        LETTER[1] - 2 * margin - footer_gap,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    template = PageTemplate(id="source", frames=[frame], onPage=NumberedCanvasMixin.draw_page_number)
    doc = BaseDocTemplate(
        str(OUTPUT_PDF),
        pagesize=LETTER,
        leftMargin=margin,
        rightMargin=margin,
        topMargin=margin,
        bottomMargin=margin + footer_gap,
        pageTemplates=[template],
        title="FSD Practical 06 to 11 Source Code",
        author="Full Stack Development Practical Submission",
        subject="Source code for Full Stack Development Practicals 6 to 11",
        creator="ReportLab",
    )

    practical_style = ParagraphStyle(
        "Practical",
        fontName="Arial-Bold",
        fontSize=12.5,
        leading=14.5,
        textColor="black",
        spaceAfter=3,
        alignment=TA_LEFT,
    )
    question_style = ParagraphStyle(
        "Question",
        fontName="Arial",
        fontSize=10.5,
        leading=13,
        textColor="black",
        spaceAfter=8,
        alignment=TA_LEFT,
    )
    file_style = ParagraphStyle(
        "File",
        fontName="Arial-Bold",
        fontSize=11,
        leading=13,
        textColor="black",
        spaceBefore=5,
        spaceAfter=1.5,
        keepWithNext=True,
        alignment=TA_LEFT,
    )
    code_style = ParagraphStyle(
        "Code",
        fontName="Arial",
        fontSize=8,
        leading=9.35,
        textColor="black",
        leftIndent=0,
        rightIndent=0,
        spaceBefore=0,
        spaceAfter=2,
        allowWidows=1,
        allowOrphans=1,
    )
    first_code_style = ParagraphStyle(
        "FirstCodeLines",
        parent=code_style,
        keepWithNext=False,
    )

    printable_width = LETTER[0] - 2 * margin
    story = []
    for practical_index, practical in enumerate(PRACTICALS):
        if practical_index:
            story.append(PageBreak())
        story.append(Paragraph(f"PRACTICAL {practical['number']}", practical_style))
        story.append(Paragraph(escape(practical["question"]), question_style))
        for file_index, relative_path in enumerate(practical["files"], start=1):
            display_name = relative_path.split("/", 1)[1]
            story.append(Paragraph(f"{file_index}. {escape(display_name)}", file_style))
            wrapped = wrap_code(read_source(relative_path), printable_width, "Arial", 8)
            code_lines = wrapped.split("\n")
            first_lines = "\n".join(code_lines[:5])
            remaining_lines = "\n".join(code_lines[5:])
            story.append(HybridPreformatted(first_lines, first_code_style, dedent=0))
            if remaining_lines:
                story.append(HybridPreformatted(remaining_lines, code_style, dedent=0))
            story.append(Spacer(1, 1))

    doc.build(story)
    print(f"Created: {OUTPUT_PDF}")
    for practical in PRACTICALS:
        print(f"Practical {practical['number']}: {', '.join(practical['files'])}")


if __name__ == "__main__":
    build_pdf()
