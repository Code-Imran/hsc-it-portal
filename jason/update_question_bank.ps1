# ==============================================================================
# IT PORTAL — Automatic Question Bank Batch Updater
# Appends missing high-yield questions to chapters 1 through 5 in one shot.
# ==============================================================================

$ErrorActionPreference = "Stop"

# Detect whether files are named .json or .jason
$ext = ".json"
if (-not (Test-Path "1.json") -and (Test-Path "1.jason")) {
    $ext = ".jason"
}

Write-Host "Detected file extension: $ext" -ForegroundColor Cyan

# Define the new questions mapped by chapter number
$additions = @{
    1 = @'
[
  {
    "id": "IT-C01-FIB-011",
    "chapter_id": 1,
    "exam_section": "Q1",
    "type": "fill_in_the_blanks",
    "marks": 1,
    "difficulty": "medium",
    "question": "The ______ attribute in HTML5 form input specifies a regular expression used to validate the input value.",
    "options": [],
    "server_only": {
      "answer": ["pattern"],
      "explanation": "The 'pattern' attribute specifies a regular expression (regex) that the input element's value is checked against on form submission.",
      "source_reference": "State Board Syllabus Sec 1.2, Page 4",
      "board_exam_appeared": true,
      "board_exam_years": ["March 2022", "March 2024"]
    }
  },
  {
    "id": "IT-C01-FIB-012",
    "chapter_id": 1,
    "exam_section": "Q1",
    "type": "fill_in_the_blanks",
    "marks": 1,
    "difficulty": "easy",
    "question": "The ______ attribute in HTML5 form controls displays a short hint in the field before the user enters a value.",
    "options": [],
    "server_only": {
      "answer": ["placeholder"],
      "explanation": "The 'placeholder' attribute provides a temporary hint describing the expected value of an input field.",
      "source_reference": "State Board Syllabus Sec 1.2, Page 5",
      "board_exam_appeared": true,
      "board_exam_years": ["March 2023"]
    }
  },
  {
    "id": "IT-C01-TF-008",
    "chapter_id": 1,
    "exam_section": "Q2",
    "type": "true_false",
    "marks": 1,
    "difficulty": "medium",
    "question": "The 'autofocus' attribute can be applied to multiple input elements on the same webpage simultaneously.",
    "options": ["True", "False"],
    "server_only": {
      "answer": 1,
      "explanation": "Only one element in an entire HTML document can have the 'autofocus' attribute at a time.",
      "source_reference": "State Board Syllabus Sec 1.2, Page 6",
      "board_exam_appeared": false,
      "board_exam_years": []
    }
  },
  {
    "id": "IT-C01-MCQ1-005",
    "chapter_id": 1,
    "exam_section": "Q3",
    "type": "MCQ_correct1",
    "marks": 1,
    "difficulty": "medium",
    "question": "Which CSS pseudo-class is applied when a user hovers their mouse pointer over an HTML element?",
    "options": [":hover", ":active", ":visited", ":focus"],
    "server_only": {
      "answer": 0,
      "explanation": "The ':hover' pseudo-class styles an element when the user positions a pointing device over it.",
      "source_reference": "State Board Syllabus Sec 1.5, Page 14",
      "board_exam_appeared": true,
      "board_exam_years": ["July 2022", "March 2024"]
    }
  },
  {
    "id": "IT-C01-MCQ2-005",
    "chapter_id": 1,
    "exam_section": "Q4",
    "type": "MCQ_correct2",
    "marks": 2,
    "difficulty": "medium",
    "question": "Which TWO video file formats are officially supported and recognized by the HTML5 <video> tag?",
    "options": ["MP4", "WebM", "AVI", "WMV", "FLV"],
    "server_only": {
      "answer": [0, 1],
      "explanation": "HTML5 officially specifies support for MP4, WebM, and Ogg video formats.",
      "source_reference": "State Board Syllabus Sec 1.4, Page 11",
      "board_exam_appeared": true,
      "board_exam_years": ["March 2023"]
    }
  },
  {
    "id": "IT-C01-MCQ3-008",
    "chapter_id": 1,
    "exam_section": "Q5",
    "type": "MCQ_correct3",
    "marks": 3,
    "difficulty": "hard",
    "question": "Which THREE shapes are valid values for the 'shape' attribute inside an <area> tag in a client-side image map?",
    "options": ["rect", "circle", "poly", "square", "triangle", "oval"],
    "server_only": {
      "answer": [0, 1, 2],
      "explanation": "The HTML <area> tag supports only 'rect' (rectangle), 'circle', 'poly' (polygon), and 'default'.",
      "source_reference": "State Board Syllabus Sec 1.3, Page 8",
      "board_exam_appeared": true,
      "board_exam_years": ["March 2022"]
    }
  }
]
'@

    2 = @'
[
  {
    "id": "IT-C02-FIB-005",
    "chapter_id": 2,
    "exam_section": "Q1",
    "type": "fill_in_the_blanks",
    "marks": 1,
    "difficulty": "medium",
    "question": "An ______ sitemap is specifically formatted to help search engine crawlers discover all URLs on a website.",
    "options": [],
    "server_only": {
      "answer": ["XML", "xml"],
      "explanation": "XML sitemaps provide structured URL feeds specifically designed for search engine bots rather than human readers.",
      "source_reference": "State Board Syllabus Sec 2.3, Page 31",
      "board_exam_appeared": true,
      "board_exam_years": ["March 2022", "March 2024"]
    }
  },
  {
    "id": "IT-C02-FIB-006",
    "chapter_id": 2,
    "exam_section": "Q1",
    "type": "fill_in_the_blanks",
    "marks": 1,
    "difficulty": "hard",
    "question": "The percentage of visitors who enter a website and leave immediately without viewing any other pages is called ______ rate.",
    "options": [],
    "server_only": {
      "answer": ["bounce", "Bounce"],
      "explanation": "Bounce rate measures the percentage of single-page sessions where the visitor leaves directly from the landing page.",
      "source_reference": "State Board Syllabus Sec 2.4, Page 33",
      "board_exam_appeared": true,
      "board_exam_years": ["July 2023"]
    }
  },
  {
    "id": "IT-C02-TF-005",
    "chapter_id": 2,
    "exam_section": "Q2",
    "type": "true_false",
    "marks": 1,
    "difficulty": "medium",
    "question": "Using identical title tags and meta descriptions across every page of a website is recommended for good SEO.",
    "options": ["True", "False"],
    "server_only": {
      "answer": 1,
      "explanation": "Duplicate title and description tags cause internal keyword cannibalization and degrade search rankings.",
      "source_reference": "State Board Syllabus Sec 2.2, Page 29",
      "board_exam_appeared": false,
      "board_exam_years": []
    }
  },
  {
    "id": "IT-C02-MCQ1-004",
    "chapter_id": 2,
    "exam_section": "Q3",
    "type": "MCQ_correct1",
    "marks": 1,
    "difficulty": "easy",
    "question": "Which of the following is an automated program used by search engines to index web documents?",
    "options": ["Crawler / Spider", "Compiler", "Interpreter", "Debugger"],
    "server_only": {
      "answer": 0,
      "explanation": "Web crawlers (also called spiders or bots) scan and fetch pages across the web to populate search engine indices.",
      "source_reference": "State Board Syllabus Sec 2.1, Page 27",
      "board_exam_appeared": true,
      "board_exam_years": ["March 2020", "March 2023"]
    }
  },
  {
    "id": "IT-C02-MCQ2-003",
    "chapter_id": 2,
    "exam_section": "Q4",
    "type": "MCQ_correct2",
    "marks": 2,
    "difficulty": "medium",
    "question": "Which TWO SEO audit tools are officially mentioned in the Maharashtra State Board syllabus?",
    "options": ["SEOptimer", "Google Search Console", "Adobe Photoshop", "Visual Studio Code", "Wireshark"],
    "server_only": {
      "answer": [0, 1],
      "explanation": "SEOptimer and Google Search Console are the primary audit and performance tools emphasized in the textbook.",
      "source_reference": "State Board Syllabus Sec 2.4, Page 33",
      "board_exam_appeared": true,
      "board_exam_years": ["July 2022", "March 2024"]
    }
  }
]
'@

    3 = @'
[
  {
    "id": "IT-C03-FIB-006",
    "chapter_id": 3,
    "exam_section": "Q1",
    "type": "fill_in_the_blanks",
    "marks": 1,
    "difficulty": "medium",
    "question": "The ______ function is used to check whether a given value is an illegal number (Not-a-Number).",
    "options": [],
    "server_only": {
      "answer": ["isNaN()", "isNaN"],
      "explanation": "The global isNaN() function evaluates an argument and returns true if it is Not-a-Number.",
      "source_reference": "State Board Syllabus Sec 3.3, Page 43",
      "board_exam_appeared": true,
      "board_exam_years": ["March 2022", "March 2024"]
    }
  },
  {
    "id": "IT-C03-FIB-007",
    "chapter_id": 3,
    "exam_section": "Q1",
    "type": "fill_in_the_blanks",
    "marks": 1,
    "difficulty": "hard",
    "question": "The ______ property of the document object returns the title of the current HTML document.",
    "options": [],
    "server_only": {
      "answer": ["title"],
      "explanation": "document.title gets or sets the title string defined in the <title> tag of the document.",
      "source_reference": "State Board Syllabus Sec 3.4, Page 47",
      "board_exam_appeared": false,
      "board_exam_years": []
    }
  },
  {
    "id": "IT-C03-TF-006",
    "chapter_id": 3,
    "exam_section": "Q2",
    "type": "true_false",
    "marks": 1,
    "difficulty": "medium",
    "question": "In JavaScript, the prompt() method returns null if the user clicks the 'Cancel' button.",
    "options": ["True", "False"],
    "server_only": {
      "answer": 0,
      "explanation": "window.prompt() returns the entered text string on 'OK', or null if the user dismisses the dialog via 'Cancel'.",
      "source_reference": "State Board Syllabus Sec 3.2, Page 40",
      "board_exam_appeared": true,
      "board_exam_years": ["July 2023"]
    }
  },
  {
    "id": "IT-C03-MCQ1-006",
    "chapter_id": 3,
    "exam_section": "Q3",
    "type": "MCQ_correct1",
    "marks": 1,
    "difficulty": "hard",
    "question": "What is the output of the following JavaScript statement: document.write(Math.floor(7.8));",
    "options": ["7", "8", "7.8", "undefined"],
    "server_only": {
      "answer": 0,
      "explanation": "Math.floor() rounds downwards to the nearest integer, so 7.8 becomes 7.",
      "source_reference": "State Board Syllabus Sec 3.3, Page 44",
      "board_exam_appeared": true,
      "board_exam_years": ["March 2020", "March 2023"]
    }
  },
  {
    "id": "IT-C03-MCQ2-003",
    "chapter_id": 3,
    "exam_section": "Q4",
    "type": "MCQ_correct2",
    "marks": 2,
    "difficulty": "medium",
    "question": "Which TWO methods belong to the built-in JavaScript 'Date' object?",
    "options": ["getDate()", "getFullYear()", "getDaylight()", "formatDate()", "createDate()"],
    "server_only": {
      "answer": [0, 1],
      "explanation": "getDate() returns the day of the month (1-31) and getFullYear() returns the 4-digit year.",
      "source_reference": "State Board Syllabus Sec 3.3, Page 45",
      "board_exam_appeared": true,
      "board_exam_years": ["March 2022"]
    }
  }
]
'@

    4 = @'
[
  {
    "id": "IT-C04-FIB-006",
    "chapter_id": 4,
    "exam_section": "Q1",
    "type": "fill_in_the_blanks",
    "marks": 1,
    "difficulty": "hard",
    "question": "In 5G networks, ______ allows physical networks to be separated into multiple virtual networks tailored to specific services.",
    "options": [],
    "server_only": {
      "answer": ["Network Slicing", "network slicing", "Network slicing"],
      "explanation": "Network Slicing enables operators to provide dedicated virtual networks over a common physical infrastructure.",
      "source_reference": "State Board Syllabus Sec 4.4, Page 61",
      "board_exam_appeared": true,
      "board_exam_years": ["March 2023"]
    }
  },
  {
    "id": "IT-C04-TF-006",
    "chapter_id": 4,
    "exam_section": "Q2",
    "type": "true_false",
    "marks": 1,
    "difficulty": "easy",
    "question": "Community cloud infrastructure is shared exclusively among several organizations with shared concerns.",
    "options": ["True", "False"],
    "server_only": {
      "answer": 0,
      "explanation": "A community cloud is provisioned for exclusive use by a specific community of organizations having shared compliance or mission requirements.",
      "source_reference": "State Board Syllabus Sec 4.2, Page 57",
      "board_exam_appeared": true,
      "board_exam_years": ["July 2022", "March 2024"]
    }
  },
  {
    "id": "IT-C04-MCQ1-005",
    "chapter_id": 4,
    "exam_section": "Q3",
    "type": "MCQ_correct1",
    "marks": 1,
    "difficulty": "medium",
    "question": "Which of the following is an example of Infrastructure as a Service (IaaS)?",
    "options": ["Amazon EC2", "Google Docs", "Salesforce CRM", "Microsoft Word Online"],
    "server_only": {
      "answer": 0,
      "explanation": "Amazon EC2 provisions virtual machines, raw compute power, and servers, making it an IaaS model.",
      "source_reference": "State Board Syllabus Sec 4.2, Page 56",
      "board_exam_appeared": true,
      "board_exam_years": ["March 2022"]
    }
  },
  {
    "id": "IT-C04-MCQ2-004",
    "chapter_id": 4,
    "exam_section": "Q4",
    "type": "MCQ_correct2",
    "marks": 2,
    "difficulty": "medium",
    "question": "Which TWO fields are prominent sub-domains of Artificial Intelligence?",
    "options": ["Machine Learning", "Natural Language Processing", "Quantum Thermodynamics", "Mechanical Drafting", "Analog Relaying"],
    "server_only": {
      "answer": [0, 1],
      "explanation": "Machine Learning (ML) and Natural Language Processing (NLP) are core branches of AI.",
      "source_reference": "State Board Syllabus Sec 4.3, Page 59",
      "board_exam_appeared": true,
      "board_exam_years": ["March 2024"]
    }
  }
]
'@

    5 = @'
[
  {
    "id": "IT-C05-FIB-006",
    "chapter_id": 5,
    "exam_section": "Q1",
    "type": "fill_in_the_blanks",
    "marks": 1,
    "difficulty": "medium",
    "question": "The ______ function in PHP is used to reverse a given string.",
    "options": [],
    "server_only": {
      "answer": ["strrev()", "strrev"],
      "explanation": "strrev() takes a string as an argument and returns the reversed string.",
      "source_reference": "State Board Syllabus Sec 5.3, Page 75",
      "board_exam_appeared": true,
      "board_exam_years": ["March 2022", "March 2024"]
    }
  },
  {
    "id": "IT-C05-FIB-007",
    "chapter_id": 5,
    "exam_section": "Q1",
    "type": "fill_in_the_blanks",
    "marks": 1,
    "difficulty": "hard",
    "question": "To start or resume a session in PHP, the ______ function must be called before sending any HTML output.",
    "options": [],
    "server_only": {
      "answer": ["session_start()", "session_start"],
      "explanation": "session_start() initializes session data and must be invoked prior to sending any headers or page content.",
      "source_reference": "State Board Syllabus Sec 5.5, Page 80",
      "board_exam_appeared": true,
      "board_exam_years": ["July 2023"]
    }
  },
  {
    "id": "IT-C05-TF-006",
    "chapter_id": 5,
    "exam_section": "Q2",
    "type": "true_false",
    "marks": 1,
    "difficulty": "easy",
    "question": "In PHP, the '==' operator checks for equality of value, whereas '===' checks for both value and data type.",
    "options": ["True", "False"],
    "server_only": {
      "answer": 0,
      "explanation": "== is loose equality (with type coercion), and === is strict identity checking value and type without conversion.",
      "source_reference": "State Board Syllabus Sec 5.2, Page 71",
      "board_exam_appeared": true,
      "board_exam_years": ["March 2020", "March 2023"]
    }
  },
  {
    "id": "IT-C05-MCQ1-005",
    "chapter_id": 5,
    "exam_section": "Q3",
    "type": "MCQ_correct1",
    "marks": 1,
    "difficulty": "medium",
    "question": "What is the output of the following PHP code: echo strlen(\"Information\");",
    "options": ["10", "11", "12", "9"],
    "server_only": {
      "answer": 1,
      "explanation": "The word 'Information' consists of exactly 11 characters. strlen() returns 11.",
      "source_reference": "State Board Syllabus Sec 5.3, Page 74",
      "board_exam_appeared": true,
      "board_exam_years": ["March 2022"]
    }
  },
  {
    "id": "IT-C05-MCQ2-004",
    "chapter_id": 5,
    "exam_section": "Q4",
    "type": "MCQ_correct2",
    "marks": 2,
    "difficulty": "hard",
    "question": "Which TWO superglobal arrays in PHP are used to handle client state and persistent identification?",
    "options": ["$_COOKIE", "$_SESSION", "$_DATABASE", "$_CLIENT", "$_HEADER"],
    "server_only": {
      "answer": [0, 1],
      "explanation": "$_COOKIE handles data stored on the client machine, and $_SESSION manages persistent state on the web server.",
      "source_reference": "State Board Syllabus Sec 5.5, Page 79",
      "board_exam_appeared": true,
      "board_exam_years": ["March 2024"]
    }
  }
]
'@
}

# Iterate through chapters 1 to 5
1..5 | ForEach-Object {
    $ch = $_
    $filePath = "$ch$ext"

    if (-not (Test-Path $filePath)) {
        Write-Warning "File $filePath not found in current directory. Skipping."
        return
    }

    Write-Host "Processing Chapter $ch ($filePath)..." -ForegroundColor Yellow

    # Create safety backup
    Copy-Item -Path $filePath -Destination "$filePath.bak" -Force

    # Read and parse existing JSON
    $jsonContent = Get-Content -Path $filePath -Raw -Encoding UTF8 | ConvertFrom-Json
    $newQuestions = $additions[$ch] | ConvertFrom-Json

    # Track existing IDs to prevent duplicate inserts
    $existingIds = [System.Collections.Generic.HashSet[string]]::new()
    foreach ($q in $jsonContent.questions) {
        [void]$existingIds.Add($q.id)
    }

    $appendedCount = 0
    $questionList = [System.Collections.ArrayList]::new($jsonContent.questions)

    foreach ($newQ in $newQuestions) {
        if (-not $existingIds.Contains($newQ.id)) {
            [void]$questionList.Add($newQ)
            $appendedCount++
        }
    }

    $jsonContent.questions = $questionList

    # Write back clean UTF-8 formatted JSON
    $updatedJson = $jsonContent | ConvertTo-Json -Depth 10
    [System.IO.File]::WriteAllText((Resolve-Path $filePath), $updatedJson, [System.Text.Encoding]::UTF8)

    Write-Host "✔ Chapter $ch updated: added $appendedCount new questions. Total: $($questionList.Count)" -ForegroundColor Green
}

Write-Host "`nAll operations complete! Backup files (*.bak) created safely." -ForegroundColor Cyan