const rawData = [
    {
        "name": "Tolkien",
        "type": "superGroup",
        "tags": ["tolkien"],
        "contents": [
            {
                "name": "Location",
                "type": "subGroup",
                "tags": ["tolkien", "location"],
                "contents": [
                    {
                        "name": "Bloemfontein, South Africa",
                        "start": "1892-01-01",
                        "end": "1895-12-31",
                        "type": "range"
                    },
                    {
                        "name": "Birmingham and suburbs",
                        "start": "1896-01-01",
                        "end": "1911-09-30"
                    },
                    {
                        "name": "Oxford",
                        "start": "1911-10-01",
                        "end": "1915-04-01",
                        "type": "range"
                    },
                    {
                        "name": "Army",
                        "description": "Mostly training around Bedford and Staffordshire",
                        "start": "1915-04-01",
                        "end": "1916-11-08",
                        "type": "range"
                    },
                    {
                        "name": "France",
                        "start": "1916-06-06",
                        "type": "point"
                    },
                    {
                        "name": "Recovery",
                        "description": "Great Haywood, various camps and hospitals",
                        "start": "1916-11-09",
                        "end": "1918-10-31",
                        "type": "range"
                    },
                    {
                        "name": "Oxford",
                        "start": "1918-11-01",
                        "end": "1920-09-01",
                        "type": "range"
                    },
                    {
                        "name": "Leeds",
                        "start": "1920-09-01",
                        "end": "1926-01-07",
                        "type": "range"
                    },
                    {
                        "name": "5 Holly Bank",
                        "start": "1921-03-01",
                        "end": "1921-08-01",
                        "type": "range"
                    },
                    {
                        "name": "11 St Marks Terrace",
                        "start": "1921-08-01",
                        "end": "1924-03-17",
                        "type": "range"
                    },
                    {
                        "name": "2 Darnley Road",
                        "start": "1924-03-17",
                        "end": "1926-01-07",
                        "type": "range"
                    },
                    {
                        "name": "22 Northmoor Road, Oxford",
                        "start": "1926-01-07",
                        "end": "1930-01-14",
                        "type": "range"
                    },
                    {
                        "name": "20 Northmoor Road, Oxford",
                        "start": "1930-01-14",
                        "end": "1947-03-01",
                        "type": "range"
                    },
                    {
                        "name": "3 Manor Road, Oxford",
                        "start": "1947-03-01",
                        "end": "1953-03-30",
                        "type": "range"
                    },
                    {
                        "name": "76 Sandfield Road, Oxford",
                        "start": "1953-03-30",
                        "end": "1968-06-01",
                        "type": "range"
                    },
                    {
                        "name": "19 Lakeside Road, Poole",
                        "start": "1968-06-01",
                        "end": "1972-03-13",
                        "type": "range"
                    },
                    {
                        "name": "21 Merton Street, Oxford",
                        "start": "1972-03-13",
                        "end": "1973-09-02",
                        "type": "range"
                    }
                ]
            },
            {
                "name": "Occupation",
                "type": "subGroup",
                "tags": ["tolkien", "occupation"],
                "contents": [
                    {
                        "name": "King Edward's School",
                        "start": "1900-01-01",
                        "end": "1901-12-31",
                        "type": "range"
                    },
                    {
                        "name": "St. Phillip's School",
                        "start": "1902-01-01",
                        "end": "1902-11-01",
                        "type": "range"
                    },
                    {
                        "name": "King Edward's School",
                        "start": "1902-11-01",
                        "end": "1911-09-30",
                        "type": "range"
                    },
                    {
                        "name": "Exeter College",
                        "description": "Student",
                        "start": "1911-10-01",
                        "end": "1915-04-01",
                        "type": "range"
                    },
                    {
                        "name": "Army training",
                        "start": "1915-04-01",
                        "end": "1916-06-06",
                        "type": "range"
                    },
                    {
                        "name": "Army service",
                        "start": "1916-06-06",
                        "end": "1916-11-09",
                        "type": "range"
                    },
                    {
                        "name": "Convalescence",
                        "description": "Some garrison duties when able",
                        "start": "1916-11-09",
                        "end": "1919-07-16",
                        "type": "range"
                    },
                    {
                        "name": "O.E.D.",
                        "start": "1919-07-16",
                        "end": "1920-06-30",
                        "type": "range"
                    },
                    {
                        "name": "Leeds University",
                        "description": "Reader in English Language",
                        "start": "1920-10-01",
                        "end": "1925-09-30",
                        "type": "range"
                    },
                    {
                        "name": "Pembroke College",
                        "description": "Rawlinson and Bosworth Professor of Anglo-Saxon",
                        "start": "1925-10-01",
                        "end": "1945-09-30",
                        "type": "range"
                    },
                    {
                        "name": "Merton College",
                        "description": "Merton Professor of English Language and Literature",
                        "start": "1945-10-01",
                        "end": "1959-12-31",
                        "type": "range"
                    },
                    {
                        "name": "Retirement",
                        "start": "1960-01-01",
                        "end": "1973-09-02",
                        "type": "range"
                    }
                ]
            },
            {
                "name": "Life Events",
                "type": "subGroup",
                "tags": ["tolkien", "life"],
                "contents": [
                    {
                        "name": "Birth of J.R.R. Tolkien",
                        "start": "1892-01-03",
                        "type": "point"
                    },
                    {
                        "name": "Death of Arthur Tolkien",
                        "description": "J.R.R. Tolkien's father",
                        "start": "1896-02-15",
                        "type": "point"
                    },
                    {
                        "name": "Marriage of J.R.R. Tolkien & Edith Bratt",
                        "start": "1916-03-22",
                        "type": "point"
                    },
                    {
                        "name": "Tolkiens convert to Catholicism",
                        "start": "1900-06-01",
                        "type": "point"
                    },
                    {
                        "name": "Death of Mabel Tolkien",
                        "description": "J.R.R. Tolkien's mother",
                        "start": "1904-11-01",
                        "type": "point"
                    },
                    {
                        "name": "Tolkien meets Edith",
                        "start": "1908-01-01",
                        "type": "point"
                    },
                    {
                        "name": "Communication with Edith forbidden",
                        "start": "1910-01-21",
                        "type": "point"
                    },
                    {
                        "name": "T.C.B.S. formed",
                        "start": "1911-07-01",
                        "type": "point"
                    },
                    {
                        "name": "Tolkien visits Switzerland",
                        "start": "1911-08-01",
                        "type": "point"
                    },
                    {
                        "name": "Tolkien writes to Edith",
                        "start": "1913-01-03",
                        "type": "point"
                    },
                    {
                        "name": "Tolkien joins army",
                        "description": "Receives commission in Lancashire Fusiliers",
                        "start": "1915-07-15",
                        "type": "point"
                    },
                    {
                        "name": "Final T.C.B.S. meeting",
                        "start": "1915-09-26",
                        "type": "point"
                    },
                    {
                        "name": "Edith dances in glade",
                        "start": "1917-05-01",
                        "type": "point"
                    },
                    {
                        "name": "John Tolkien born",
                        "start": "1917-11-16",
                        "type": "point"
                    },
                    {
                        "name": "Michael Tolkien born",
                        "start": "1920-10-22",
                        "type": "point"
                    },
                    {
                        "name": "Christopher Tolkien born",
                        "start": "1924-11-21",
                        "type": "point"
                    },
                    {
                        "name": "Priscilla Tolkien born",
                        "start": "1929-06-18",
                        "type": "point"
                    },
                    {
                        "name": "Tolkiens' Mediterranean cruise",
                        "start": "1966-09-14",
                        "end": "1966-10-06",
                        "type": "point"
                    },
                    {
                        "name": "Death of Edith Tolkien",
                        "start": "1971-11-29",
                        "type": "point"
                    },
                    {
                        "name": "Tolkien receives CBE",
                        "start": "1972-01-01",
                        "type": "point"
                    }
                ]
            },
            {
                "name": "Major Publications",
                "type": "subGroup",
                "tags": ["tolkien", "major-publications"],
                "contents": [
                    {
                        "name": "The Hobbit",
                        "start": "1937-09-21",
                        "type": "point"
                    },
                    {
                        "name": "Leaf by Niggle",
                        "start": "1945-01-01",
                        "type": "point"
                    },
                    {
                        "name": "On Fairy Stories",
                        "description": "Essays Presented to Charles Williams",
                        "start": "1947-12-04",
                        "type": "point"
                    },
                    {
                        "name": "Farmer Giles of Ham",
                        "start": "1949-10-20",
                        "type": "point"
                    },
                    {
                        "name": "The Fellowship of the Ring",
                        "start": "1954-07-29",
                        "type": "point"
                    },
                    {
                        "name": "The Two Towers",
                        "start": "1954-11-11",
                        "type": "point"
                    },
                    {
                        "name": "The Return of the King",
                        "start": "1955-10-20",
                        "type": "point"
                    },
                    {
                        "name": "Smith of Wooton Major",
                        "start": "1967-11-09",
                        "type": "point"
                    },
                    {
                        "name": "The Silmarillion",
                        "start": "1977-09-15",
                        "type": "point"
                    },
                    {
                        "name": "Unfinished Tales",
                        "start": "1980-10-02",
                        "type": "point"
                    }
                ]
            },
            {
                "name": "Minor Publications",
                "type": "subGroup",
                "tags": ["tolkien", "minor-publications"],
                "contents": [
                    {
                        "name": "Goblin Feet",
                        "description": "Oxford Poetry 1915",
                        "start": "1915-12-01",
                        "type": "point"
                    },
                    {
                        "name": "A Middle English Vocabulary",
                        "start": "1922-05-11",
                        "type": "point"
                    },
                    {
                        "name": "Sir Gawain and the Green Knight",
                        "description": "with E.V. Gordon (Clarendon Press)",
                        "start": "1925-04-23",
                        "type": "point"
                    },
                    {
                        "name": "Errantry",
                        "description": "The Oxford Magazine",
                        "start": "1933-11-09",
                        "type": "point"
                    },
                    {
                        "name": "Beowulf: The Monsters and the Critics",
                        "start": "1937-07-01",
                        "type": "point"
                    },
                    {
                        "name": "The Homecoming of Beorhtnoth Beorhthelm's Son",
                        "start": "1953-10-01",
                        "type": "point"
                    },
                    {
                        "name": "Sir Gawain and the Green Knight broadcast on BBC Radio",
                        "start": "1953-12-06",
                        "type": "point"
                    },
                    {
                        "name": "The Adventures of Tom Bombadil",
                        "start": "1962-11-22",
                        "type": "point"
                    },
                    {
                        "name": "English and Welsh",
                        "start": "1963-07-08",
                        "type": "point"
                    },
                    {
                        "name": "Tree and Leaf",
                        "start": "1964-05-28",
                        "type": "point"
                    },
                    {
                        "name": "Ace Books LOTR",
                        "description": "unauthorized",
                        "start": "1965-07-01",
                        "type": "point"
                    },
                    {
                        "name": "Ballantine Books LOTR",
                        "start": "1965-12-01",
                        "type": "point"
                    },
                    {
                        "name": "The Jerusalem Bible",
                        "description": "Jonah by Tolkien",
                        "start": "1966-01-01",
                        "type": "point"
                    },
                    {
                        "name": "LOTR 2ed.",
                        "start": "1966-10-27",
                        "type": "point"
                    },
                    {
                        "name": "The Road Goes Ever On",
                        "start": "1967-10-31",
                        "type": "point"
                    },
                    {
                        "name": "Father Christmas Letters",
                        "start": "1976-09-02",
                        "type": "point"
                    },
                    {
                        "name": "J.R.R. Tolkien: A Biography",
                        "description": "Carpenter",
                        "start": "1977-05-05",
                        "type": "point"
                    }
                ]
            }
        ]
    },
    {
        "name": "Lewis",
        "type": "superGroup",
        "tags": ["lewis"],
        "contents": [
            {
                "name": "Location",
                "type": "subGroup",
                "tags": ["lewis", "location"],
                "contents": [
                    {
                        "name": "Belfast",
                        "description": "Dundela Villas, near Holywood Road in East Belfast",
                        "start": "1898-11-29",
                        "end": "1905-04-21",
                        "type": "range",
                        "note": "end date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Little Lea",
                        "description": "76 Circular Road, Belfast, Northern Ireland",
                        "start": "1905-04-21",
                        "end": "1908-09-17",
                        "type": "range",
                        "note": "dates exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Watford",
                        "description": "Hertfordshire",
                        "start": "1908-09-18",
                        "end": "1910-07-31",
                        "type": "range",
                        "note": "start date exact, end date approximate",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Little Lea",
                        "start": "1910-07-01",
                        "end": "1911-01-10",
                        "type": "range",
                        "note": "start date approximate, end date likely",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Malvern, England",
                        "start": "1911-01-10",
                        "end": "1914-07-29",
                        "type": "range",
                        "note": "start date likely, end date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Great Bookham",
                        "description": "Surrey",
                        "start": "1914-09-19",
                        "end": "1917-04-25",
                        "type": "range",
                        "note": "dates exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Oxford",
                        "start": "1917-04-26",
                        "end": "1917-11-17",
                        "type": "range",
                        "note": "dates exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "France",
                        "start": "1917-11-17",
                        "end": "1918-05-24",
                        "type": "range",
                        "note": "start date exact, end date approximate",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Oxford",
                        "start": "1919-01-13",
                        "end": "1930-10-11",
                        "type": "range",
                        "note": "dates exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "The Kilns",
                        "start": "1930-10-11",
                        "end": "1954-12-31",
                        "type": "range",
                        "note": "dates exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "The Kilns and Cambridge",
                        "description": "Cambridge for academic duties and writing, the Kilns for weekends and holidays",
                        "start": "1955-01-01",
                        "end": "1963-11-22",
                        "type": "range",
                        "note": "dates exact",
                        "source": "Chronologically Lewis"
                    }
                ]
            },
            {
                "name": "Occupation",
                "type": "subGroup",
                "tags": ["lewis", "occupation"],
                "contents": [
                    {
                        "name": "Wynyard School",
                        "start": "1908-09-18",
                        "end": "1910-07-12",
                        "type": "range",
                        "note": "exact dates",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Campbell College",
                        "start": "1910-09-01",
                        "end": "1910-11-15",
                        "type": "range",
                        "note": "start month, exact finish date",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Cherbourg House",
                        "start": "1911-01-10",
                        "end": "1913-07-29",
                        "type": "range",
                        "note": "start date likely, end date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Malvern College",
                        "start": "1913-09-18",
                        "end": "1914-07-28",
                        "type": "range",
                        "note": "dates exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Kirkpatrick",
                        "description": "private study with William T. Kirkpatrick, \"The Great Knock\"",
                        "start": "1914-09-14",
                        "end": "1917-04-25",
                        "type": "range",
                        "note": "dates exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "University College",
                        "description": "Student",
                        "start": "1917-04-26",
                        "end": "1917-09-14",
                        "type": "range"
                    },
                    {
                        "name": "Army",
                        "start": "1917-09-15",
                        "end": "1918-12-24",
                        "type": "range"
                    },
                    {
                        "name": "University College",
                        "description": "Student: Honour Moderations, Greats, English",
                        "start": "1919-01-13",
                        "end": "1924-07-16",
                        "type": "range",
                        "note": "dates accurate but confusing",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "University College",
                        "description": "Filling in as Philosophy lecturer",
                        "start": "1924-10-14",
                        "end": "1925-05-19",
                        "type": "range",
                        "note": "start date exact, end date very rough",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Magdalen College, Oxford",
                        "description": "Fellow and Tutor in English",
                        "start": "1925-05-20",
                        "end": "1954-06-04",
                        "type": "range",
                        "note": "dates exact, up to his resignation letter. Final lecture was Dec. 3",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Magdalene College, Cambridge",
                        "description": "Professor of Medieval and Renaissance Literature",
                        "start": "1954-06-04",
                        "end": "1963-08-11",
                        "type": "range",
                        "note": "start date exact, end date approx (it was by then at the latest that he resigned)",
                        "source": "Chronologically Lewis"
                    }
                ]
            },
            {
                "name": "Life Events",
                "type": "subGroup",
                "tags": ["lewis", "life"],
                "contents": [
                    {
                        "name": "Birth of C.S. Lewis",
                        "start": "1898-11-29",
                        "type": "point"
                    },
                    {
                        "name": "Death of Mabel Lewis",
                        "description": "C.S. Lewis's mother",
                        "start": "1908-08-23",
                        "type": "point"
                    },
                    {
                        "name": "Lewis has lung troubles",
                        "start": "1910-11-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis meets Arthur Greeves",
                        "start": "1914-04-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis joins army",
                        "description": "Receives commission as an officer in the 3rd Battalion, Somerset Light Infantry",
                        "start": "1917-09-25",
                        "type": "point"
                    },
                    {
                        "name": "Lewis injured",
                        "description": "Mount Berenchon, Battle of Arras",
                        "start": "1918-04-15",
                        "type": "point"
                    },
                    {
                        "name": "Lewis learns of “Paddy” Moore's death",
                        "start": "1918-05-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis discharged",
                        "start": "1919-12-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis moves in with Moores",
                        "start": "1921-06-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis becomes theist",
                        "description": "\"Most reluctant convert.\" He reports the date to be Trinity Term 1929, but most scholars believe he is off by a year.",
                        "start": "1930-06-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis becomes Christian",
                        "start": "1931-09-28",
                        "type": "point"
                    },
                    {
                        "name": "Death of Mrs. Moore",
                        "start": "1951-01-12",
                        "type": "point"
                    },
                    {
                        "name": "Lewis loses election for Professor of Poetry",
                        "start": "1951-05-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis declines O.B.E.",
                        "start": "1951-12-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis meets Joy Gresham",
                        "start": "1952-09-01",
                        "type": "point"
                    },
                    {
                        "name": "Marriage of C.S. Lewis and Joy Davidman",
                        "description": "Civil marriage at Oxford Registry Office",
                        "start": "1956-04-23",
                        "type": "point"
                    },
                    {
                        "name": "Joy diagnosed with cancer",
                        "start": "1956-10-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis & Joy's Anglican marriage",
                        "description": "Wingfield Hospital, because of Joy's suspected imminent death",
                        "start": "1956-12-01",
                        "type": "point"
                    },
                    {
                        "name": "Death of Joy Davidman",
                        "start": "1960-07-13",
                        "type": "point"
                    },
                    {
                        "name": "Death of C.S. Lewis",
                        "start": "1963-11-22",
                        "type": "point"
                    }
                ]
            },
            {
                "name": "Major Publications",
                "type": "subGroup",
                "tags": ["lewis", "major-publications"],
                "contents": [
                    {
                        "name": "Out of the Silent Planet",
                        "start": "1938-09-23",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "The Problem of Pain",
                        "start": "1940-10-18",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "The Screwtape Letters",
                        "description": "in book form",
                        "start": "1942-02-09",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Perelandra",
                        "start": "1943-04-20",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "The Abolition of Man",
                        "start": "1944-01-06",
                        "type": "point",
                        "note": "Lecture happened on Feb 23 1943",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "That Hideous Strength",
                        "start": "1945-08-16",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "The Great Divorce",
                        "description": "published in serial form in the Guardian from Nov. 10 1944 to Apr. 13 1945",
                        "start": "1946-01-14",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Miracles",
                        "start": "1947-05-12",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "The Lion, the Witch, and the Wardrobe",
                        "start": "1950-10-16",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Prince Caspian",
                        "start": "1951-10-15",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Mere Christianity",
                        "description": "Compiling his talks from the war",
                        "start": "1952-07-07",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "The Voyage of the Dawn Treader",
                        "start": "1952-09-15",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "The Silver Chair",
                        "start": "1953-09-07",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "The Horse and His Boy",
                        "start": "1954-09-06",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Surprised by Joy",
                        "start": "1955-01-01",
                        "type": "point",
                        "note": "date approximate",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "The Magicians Nephew",
                        "start": "1955-05-02",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Till We Have Faces",
                        "start": "1956-09-10",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "The Last Battle",
                        "start": "1956-03-19",
                        "type": "point"
                    },
                    {
                        "name": "The Four Loves",
                        "start": "1960-03-28",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "A Grief Observed",
                        "description": "Under the name N.W. Clerk",
                        "start": "1961-09-29",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "The Discarded Image",
                        "description": "Posthumous",
                        "start": "1964-05-07",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    }
                ]
            },
            {
                "name": "Minor Publications",
                "type": "subGroup",
                "tags": ["lewis", "minor-publications"],
                "contents": [
                    {
                        "name": "The Pilgrim's Regress",
                        "description": "J.M. Dent, published under Clive Hamliton",
                        "start": "1933-05-25",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "The Allegory of Love",
                        "description": "Clarendon Press",
                        "start": "1936-05-21",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Spirits in Bondage: A Cycle of Lyrics",
                        "description": "Heinemann, published under Clive Hamilton",
                        "start": "1919-03-20",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Dymer",
                        "description": "J.M. Dent, published under Clive Hamilton",
                        "start": "1926-09-08",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "The Screwtape Letters",
                        "description": "Serial format in Anglican newspaper The Guardian",
                        "start": "1941-05-02",
                        "end": "1941-11-28",
                        "type": "range",
                        "note": "dates exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "A Preface to Paradise Lost",
                        "start": "1942-10-08",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Broadcast Talks",
                        "description": "1st part of Mere Christianity",
                        "start": "1942-07-13",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Christian Behavior",
                        "description": "2nd part of Mere Christianity",
                        "start": "1944-01-18",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Beyond Personality",
                        "description": "3rd part of Mere Christianity",
                        "start": "1944-10-09",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Essays Presented to Charles Williams",
                        "start": "1947-12-04",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Arthurian Torso",
                        "start": "1948-10-21",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Transposition and Other Addresses",
                        "start": "1949-07-02",
                        "type": "point",
                        "note": "unknown date in 1949",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "English Literature in the 16th Century, Excluding Drama",
                        "description": "Oxford History of English Literature",
                        "start": "1954-09-16",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Reflections on the Psalms",
                        "start": "1958-09-08",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Screwtape Proposes a Toast",
                        "start": "1959-12-19",
                        "description": "Article in the Saturday Evening Post",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "The World's Last Night and Other Essays",
                        "start": "1960-02-10",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Studies in Words",
                        "start": "1960-09-09",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    },
                    {
                        "name": "Letters to Malcom: Chiefly on Prayer",
                        "description": "Posthumous",
                        "start": "1964-01-27",
                        "type": "point",
                        "note": "date exact",
                        "source": "Chronologically Lewis"
                    }
                ]
            }
        ]
    },
    {
        "name": "Barfield",
        "type": "subGroup",
        "tags": ["barfield"],
        "contents": [
            {
                "name": "Birth of Owen Barfield",
                "start": "1898-11-09",
                "type": "point",
                "note": "exact date",
                "source": "Owen Barfield Literary Estate"
            },
            {
                "name": "Marriage of Owen Barfield and Maud Douie",
                "start": "1923-04-11",
                "type": "point",
                "note": "exact date",
                "source": "Chronologically Lewis"
            },
            {
                "name": "Barfield becomes Anthroposophist",
                "start": "1923-06-01",
                "type": "point",
                "note": "date approximate, joined Anthroposophic Society of Great Britain in January 1924",
                "source": "Owen Barfield Literary Estate"
            },
            {
                "name": "Poetic Diction",
                "start": "1928-05-01",
                "type": "point",
                "note": "Only year known. Lewis purchased a copy at the end of May",
                "source": "Chronologically Lewis"
            },
            {
                "name": "This Ever Diverse Pair",
                "start": "1950-01-01",
                "type": "point",
                "note": "year only",
                "source": "Owen Barfield Literary Estate"
            },
            {
                "name": "Saving the Appearances",
                "start": "1957-01-01",
                "type": "point",
                "note": "year only",
                "source": "Owen Barfield Literary Estate"
            },
            {
                "name": "Barfield retires from the law",
                "start": "1959-01-01",
                "type": "point",
                "note": "year only",
                "source": "Owen Barfield Literary Estate"
            },
            {
                "name": "Death of Owen Barfield",
                "start": "1997-12-14",
                "type": "point",
                "note": "exact date",
                "source": "Owen Barfield Literary Estate"
            }
        ]
    },
    {
        "name": "Williams",
        "type": "subGroup",
        "tags": ["williams"],
        "contents": [
            {
                "name": "Birth of Charles Williams",
                "start": "1886-09-20",
                "type": "point",
                "note": "exact date",
                "source": "The Fellowship"
            },
            {
                "name": "Started work at Oxford University Press",
                "description": "Amen House",
                "start": "1908-06-09",
                "type": "point",
                "note": "exact date",
                "source": "The Fellowship"
            },
            {
                "name": "Williams joins the Fellowship of the Rosy Cross",
                "start": "1917-09-23",
                "type": "point",
                "note": "date exact (autumn equinox)",
                "source": "The Fellowship"
            },
            {
                "name": "Place of the Lion published",
                "start": "1931-01-01",
                "type": "point",
                "note": "Only year known.",
                "source": "Charles Williams Society"
            },
            {
                "name": "Descent into Hell published",
                "start": "1937-01-01",
                "type": "point",
                "note": "Only year known.",
                "source": "Charles Williams Society"
            },
            {
                "name": "Williams moves to Oxford",
                "start": "1939-09-07",
                "type": "point",
                "note": "date exact",
                "source": "Chronologically Lewis"
            },
            {
                "name": "All Hallows' Eve published",
                "start": "1945-01-01",
                "type": "point",
                "note": "Only year known.",
                "source": "Charles Williams Society"
            },
            {
                "name": "Death of Charles Williams",
                "start": "1945-05-15",
                "type": "point",
                "note": "exact date",
                "source": "Charles Williams Society"
            }

        ]
    },
    {
        "name": "Warren Lewis",
        "type": "subgroup",
        "tags": ["wlewis"],
        "contents": [
            {
                "name": "Birth of Warren Lewis",
                "start": "1895-06-15",
                "type": "point",
                "note": "exact date",
                "source": "Chronologically Lewis"
            },
            {
                "name": "Warren Lewis army service",
                "description": `Including a posting in Sierra Leone (Mar 9, 1921 to Mar 23, 1922)
                                and two postings in China (Apr 11, 1927 to Feb 25, 1930 and Oct 9, 1931 to Oct 22, 1932)`,
                "start": "1914-01-09",
                "end": "1932-12-14",
                "type": "range",
                "note": "exact start date of receiving entrance exam results, exact end date of final arrival back in England",
                "source": "Chronologically Lewis"
            },
            {
                "name": "Warren Lewis returns to Christianity",
                "start": "1931-05-09",
                "type": "point",
                "note": "exact date",
                "source": "Chronologically Lewis"
            },
            {
                "name": "Warren Lewis moves into the Kilns",
                "start": "1932-12-21",
                "type": "point",
                "note": "exact date",
                "source": "Chronologically Lewis"
            },
            {
                "name": "Warren Lewis begins The Lewis Papers",
                "start": "1930-12-01",
                "type": "point",
                "note": "month only",
                "source": "Chronologically Lewis"
            },
            {
                "name": "The Splendid Century published",
                "start": "1953-11-01",
                "type": "point",
                "note": "sometime this year after October 17",
                "source": "Chronologically Lewis"
            },
            {
                "name": "Memoirs of the Duc de Saint-Simon published",
                "start": "1964-01-01",
                "type": "point",
                "note": "year only",
                "source": "Chronologically Lewis"
            },
            {
                "name": "Letters of C.S. Lewis published",
                "start": "1966-04-18",
                "type": "point",
                "note": "exact date",
                "source": "Chronologically Lewis"
            },
            {
                "name": "Death of Warren Lewis",
                "description": "Walter Hooper goes to visit him at the Kilns and finds he has just died.",
                "start": "1973-04-09",
                "type": "point",
                "note": "exact date",
                "source": "Chronologically Lewis"
            }

        ]
    },
    {
        "name": "Inklings",
        "type": "subGroup",
        "tags": ["inklings"],
        "contents": [
            {
                "name": "Lewis and Barfield meet",
                "start": "1919-11-15",
                "type": "point",
                "note": "month known, not date",
                "source": "Chronologically Lewis"
            },
            {

                "name": "Inklings weekly meetings",
                "description": "Thursday nights ~1929-",
                "start": "1929-12-01",
                "end": "1949-10-27",
                "type": "range",
                "note": `Start date approximate and early, based on Tolkien
                          sharing his mythology with Lewis. End date
                          approximate and late, based on Warren recording
                          a Thursday evening with Lewis where noone else came.`,
                "source": "The Company They Keep"
            },
            {
                "name": "Lewis & Barfield's Great War",
                "start": "1922-01-01",
                "end": "1931-12-31",
                "type": "range",
                "note": "approximate years, dates indetermined",
                "source": "The Company They Keep"
            },
            {
                "name": "Lewis and Tolkien meet",
                "start": "1926-05-11",
                "type": "point",
                "note": "date exact",
                "source": "Chronologically Lewis"
            },
            {
                "name": "Addison's Walk",
                "start": "1931-09-19",
                "type": "point",
                "note": "date exact",
                "source": "Chronologically Lewis"
            },
            {
                "name": "Lewis and Williams begin correspondence",
                "start": "1936-03-11",
                "type": "point",
                "note": "date exact",
                "source": "Chronologically Lewis"
            }
        ]
    }
]