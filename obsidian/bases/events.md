```base
views:
  - type: table
    name: Table
    filters:
      and:
        - file.path.startsWith("events/")
    order:
      - status
      - person
      - category
      - title
      - start
      - end
      - description
      - edtf
      - note.note
      - type
      - file.name
      - source
    sort:
      - property: source
        direction: ASC
      - property: status
        direction: ASC

```


