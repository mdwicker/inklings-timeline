```base
views:
  - type: table
    name: Table
    filters:
      and:
        - file.path.startsWith("events/")
        - status == "Check source trail"
    order:
      - id
      - person
      - category
      - title
      - sourcename
      - sourcepage
      - edtf
      - sourceaccessed
      - sourcecomment
      - note.note
      - status
      - file.name
    sort:
      - property: id
        direction: ASC
      - property: edtf
        direction: DESC
      - property: sourcename
        direction: ASC
      - property: oldsource
        direction: DESC
      - property: source
        direction: DESC
      - property: status
        direction: ASC
    columnSize:
      note.person: 85
      note.title: 137
      note.sourcename: 165
      note.sourcepage: 82
      note.sourceaccessed: 127

```


