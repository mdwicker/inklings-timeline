```base
views:
  - type: table
    name: Table
    filters:
      and:
        - file.path.startsWith("events/")
        - person == "C.S. Lewis"
    order:
      - person
      - category
      - title
      - start
      - end
      - description
      - edtf
      - status
      - source
      - note.note
      - type
      - file.name
    sort:
      - property: source
        direction: ASC

```