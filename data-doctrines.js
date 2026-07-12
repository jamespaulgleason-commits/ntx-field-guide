const DOCTRINE_CATS = [
  { id:"warrantexc",  label:"Warrant Exceptions",      hint:"Ways to search or seize without paper" },
  { id:"suppression", label:"Evidence & Suppression",  hint:"Exclusion, and the doctrines that save evidence" },
  { id:"scope",       label:"Scope of Protection",     hint:"Where the Fourth Amendment reaches" },
  { id:"liability",   label:"Liability & Duties",      hint:"Qualified immunity, knock & announce" },
];

const DOCTRINES = [
  {
    name:"Automobile Exception (Carroll Doctrine)", anchor:{name:"Carroll v. United States", cite:"267 U.S. 132 (1925)", court:"scotus"},
    also:"California v. Acevedo, 500 U.S. 565 (1991); Collins v. Virginia, 584 U.S. 586 (2018)", cat:["warrantexc"],
    kw:"car vehicle trunk search probable cause no warrant containers mobility smell of marijuana odor of weed marihuana smell alone does the smell still justify a full vehicle search hemp vs marihuana THC probable cause to search the whole car",
    summary:"With probable cause to believe a vehicle contains contraband or evidence, officers may search it without a warrant — a rule resting on vehicles' ready mobility and the reduced expectation of privacy in them. The scope follows the object: officers may search any part of the vehicle and any container within it where the item sought could be, including passengers' containers (Houghton). Collins draws the boundary at the home: the exception does not permit entering curtilage (a driveway near the house, a carport) to reach the vehicle.",
    street:[
      "Probable cause substitutes for the warrant, but it must attach to the vehicle — articulate the PC before the search, not from what the search found.",
      "Scope discipline: PC for a stolen rifle doesn't open a cigarette pack; PC for drugs opens nearly everything.",
      "The exception travels with the car, not onto the homeowner's property — a vehicle parked in curtilage needs a warrant or another exception."
    ]
  },
  {
    name:"Search Incident to Arrest", anchor:{name:"Chimel v. California", cite:"395 U.S. 752 (1969)", court:"scotus"},
    also:"United States v. Robinson, 414 U.S. 218 (1973); Arizona v. Gant, 556 U.S. 332 (2009); Riley v. California, 573 U.S. 373 (2014)", cat:["warrantexc"],
    kw:"sita arrest search person wingspan lunge reach grab area pockets",
    summary:"A lawful custodial arrest justifies a full search of the arrestee's person (Robinson — no case-by-case justification needed) and the area within their immediate control — the lunge-and-reach space (Chimel). Gant confines the vehicle version to two circumstances: the unsecured arrestee within reaching distance of the compartment, or reason to believe the vehicle holds evidence of the offense of arrest. Riley carves out cell phone data entirely: seize the phone, get a warrant for its contents.",
    street:[
      "The arrest must be lawful and custodial — a citation-in-lieu doesn't carry a search incident (Knowles v. Iowa).",
      "Time and place matter: the search must be substantially contemporaneous with the arrest.",
      "In vehicles, once the arrestee is cuffed in your unit, Gant's first prong is gone — articulate the second or find another basis."
    ]
  },
  {
    name:"Terry Doctrine (Stop & Frisk)", anchor:{name:"Terry v. Ohio", cite:"392 U.S. 1 (1968)", court:"scotus"},
    also:"Minnesota v. Dickerson, 508 U.S. 366 (1993); Illinois v. Wardlow, 528 U.S. 119 (2000)", cat:["warrantexc"],
    kw:"reasonable suspicion detention frisk patdown armed dangerous investigative stop",
    summary:"Reasonable suspicion — specific, articulable facts that criminal activity may be afoot — permits a brief investigative detention; separate reasonable suspicion that the person is armed and dangerous permits a limited pat-down of outer clothing for weapons. The stop must be temporary, last no longer than necessary, and use the least intrusive means reasonably available to confirm or dispel the suspicion.",
    street:[
      "Two separate justifications: articulate the stop and the frisk independently — a lawful stop does not automatically authorize a frisk.",
      "The frisk is for weapons; manipulating a felt object to identify it as contraband exceeds Terry (see Plain Feel).",
      "Duration discipline: once the suspicion is dispelled, the detention must end."
    ]
  },
  {
    name:"Plain View Doctrine", anchor:{name:"Horton v. California", cite:"496 U.S. 128 (1990)", court:"scotus"},
    also:"Arizona v. Hicks, 480 U.S. 321 (1987)", cat:["warrantexc","scope"],
    kw:"plain view see contraband immediately apparent lawful vantage seize",
    summary:"Officers may seize an item without a warrant when three conditions meet: (1) the officer is lawfully at the vantage point from which the item is viewed; (2) the officer has lawful access to the item itself; and (3) the item's incriminating character is immediately apparent — probable cause without further search. Hicks marks the line: moving stereo equipment to read serial numbers was itself a search requiring its own justification.",
    street:[
      "'Immediately apparent' means PC on sight — if you must move, open, or manipulate the item to know what it is, plain view is gone.",
      "Lawful vantage plus lawful access are separate: seeing contraband through a window doesn't authorize entering to grab it.",
      "Inadvertence is NOT required (Horton) — expecting to find the item doesn't defeat the doctrine."
    ]
  },
  {
    name:"Plain Feel Doctrine", anchor:{name:"Minnesota v. Dickerson", cite:"508 U.S. 366 (1993)", court:"scotus"},
    also:"", cat:["warrantexc"],
    kw:"plain feel frisk patdown lump contraband immediately apparent squeeze manipulate",
    summary:"During a lawful Terry frisk, if an officer feels an object whose identity as contraband is immediately apparent through touch — without squeezing, sliding, or otherwise manipulating it — the officer may seize it. Dickerson itself suppressed the crack cocaine because the officer determined the lump was contraband only after manipulating it, a search beyond Terry's weapons rationale.",
    street:[
      "The tactile version of plain view: the incriminating character must be apparent on the initial pat, not after exploration.",
      "Document the training and experience that made the object's identity immediately apparent to your touch.",
      "If you had to work the object to know, articulate a different basis or leave it."
    ]
  },
  {
    name:"Consent Searches", anchor:{name:"Schneckloth v. Bustamonte", cite:"412 U.S. 218 (1973)", court:"scotus"},
    also:"Georgia v. Randolph, 547 U.S. 103 (2006); Illinois v. Rodriguez, 497 U.S. 177 (1990); Florida v. Jimeno, 500 U.S. 248 (1991)", cat:["warrantexc"],
    kw:"consent voluntary permission scope withdraw refuse authority",
    summary:"Voluntary consent from a person with actual or apparent authority permits a warrantless search within the scope a reasonable person would understand the exchange to cover. Voluntariness is judged on the totality of the circumstances (no Miranda-style warning of the right to refuse is required), authority questions run through Rodriguez and Randolph, and the consenting party may limit or revoke at any time.",
    street:[
      "The full framework lives in Vols. 5's four questions: voluntary? authorized? within scope? still in effect?",
      "State the object of your search when you ask — it defines the scope you get.",
      "Record the request and the answer; BWC audio of consent wins more suppression hearings than any report language."
    ]
  },
  {
    name:"Exigent Circumstances", anchor:{name:"Kentucky v. King", cite:"563 U.S. 452 (2011)", court:"scotus"},
    also:"Missouri v. McNeely, 569 U.S. 141 (2013); Lange v. California, 594 U.S. 295 (2021)", cat:["warrantexc"],
    kw:"exigent emergency destruction evidence escape hot pursuit no time warrant",
    summary:"A true emergency — imminent destruction of evidence, a suspect's escape, or imminent harm — can excuse the warrant requirement, judged case-by-case on the facts. King holds police may rely on an exigency their lawful conduct foreseeably prompted, so long as they did not create it by violating or threatening to violate the Fourth Amendment. McNeely rejects categorical exigencies (alcohol dissolution alone doesn't excuse a blood warrant), and Lange rejects them for misdemeanor pursuit into homes.",
    street:[
      "Exigency is measured at the moment of entry: what did you know, and why couldn't the warrant wait?",
      "Electronic warrants have shrunk 'no time' — document why even the fast path wasn't fast enough.",
      "Never threaten an unlawful entry to make the noises start; that forfeits the doctrine."
    ]
  },
  {
    name:"Hot Pursuit", anchor:{name:"United States v. Santana", cite:"427 U.S. 38 (1976)", court:"scotus"},
    also:"Lange v. California, 594 U.S. 295 (2021)", cat:["warrantexc"],
    kw:"hot pursuit chase fleeing doorway retreat house entry felony misdemeanor",
    summary:"A suspect may not defeat an arrest that has been set in motion in a public place by retreating into a private one — officers in immediate, continuous pursuit may follow. Santana's arrest began at the doorway (a public place for Fourth Amendment purposes) and lawfully ended in the vestibule. Lange cabins the doctrine for misdemeanors: flight alone doesn't categorically justify home entry; a genuine case-specific exigency must exist.",
    street:[
      "The pursuit must be immediate and continuous from the public-place encounter — a gap breaks the chain.",
      "Felony pursuit stands on firmer ground; misdemeanor pursuit needs the Lange exigency articulation.",
      "Pair with CCP Art. 14.05 — the Texas statute layers its own consent-or-exigency requirement on the threshold."
    ]
  },
  { name:"Emergency Aid Doctrine", anchor:{name:"Brigham City v. Stuart", cite:"547 U.S. 398 (2006)", court:"scotus"}, also:"Michigan v. Fisher, 558 U.S. 45 (2009); Case v. Montana, 607 U.S. ___ (2026)", cat:["warrantexc"], kw:"emergency aid injured render help welfare 911 entry objectively reasonable", summary:"Officers may enter a home without a warrant when they have an objectively reasonable basis to believe an occupant is seriously injured or imminently threatened with such injury — the officers' subjective motivations are irrelevant. In Case v. Montana (2026), a unanimous Supreme Court (Kagan, J.) held that this Brigham City standard governs emergency-aid entries without further gloss: probable cause is not required (it is \"peculiarly related to criminal investigations\"), and \"reasonable suspicion\" is likewise inapt. The \"objectively reasonable basis\" test still demands genuine, articulable facts — a generalized welfare concern is not enough (Caniglia).", street:["Articulate the observable emergency: what you saw, heard, and were told at the threshold.","The entry's scope is tied to the emergency — render aid, secure, reassess; it is not a license to rummage.","This doctrine, not 'community caretaking,' is what carries welfare-check entries after Caniglia."] },
  {
    name:"Protective Sweep", anchor:{name:"Maryland v. Buie", cite:"494 U.S. 325 (1990)", court:"scotus"},
    also:"", cat:["warrantexc"],
    kw:"protective sweep clear house arrest danger hiding accomplice cursory closets",
    summary:"Incident to an in-home arrest, officers may, without any additional suspicion, look in closets and spaces immediately adjoining the place of arrest from which an attack could be launched. A sweep beyond that requires articulable facts which, with rational inferences, would warrant a reasonably prudent officer in believing the area harbors an individual posing danger. The sweep is cursory — spaces where a person could be — and lasts no longer than necessary to dispel the suspicion and complete the arrest.",
    street:[
      "Two zones: immediately adjoining spaces come free with the arrest; everything beyond needs articulable facts of a dangerous person present.",
      "It's a people search — under beds and in closets, not in drawers and boxes.",
      "Anything in plain view during a lawful sweep is seizable; anything found by exceeding it is gone."
    ]
  },
  {
    name:"Inventory Search", anchor:{name:"South Dakota v. Opperman", cite:"428 U.S. 364 (1976)", court:"scotus"},
    also:"Colorado v. Bertine, 479 U.S. 367 (1987); Florida v. Wells, 495 U.S. 1 (1990)", cat:["warrantexc"],
    kw:"inventory impound tow standardized policy caretaking containers",
    summary:"When a vehicle is lawfully impounded, a routine inventory conducted according to standardized agency procedures is reasonable without a warrant or probable cause — it protects the owner's property, protects the agency from claims, and protects officers from danger. Wells supplies the limit: an inventory must not be a ruse for general rummaging; the policy must regulate discretion (including whether containers are opened), and the search must actually follow it.",
    street:[
      "The policy is the authority — know yours, follow it exactly, and cite it in the report.",
      "An inventory motivated solely by investigation, or conducted where policy gives no standardized criteria, will be suppressed.",
      "Contraband found in a genuine inventory is admissible; the doctrine fails only when the inventory was pretext or freelance."
    ]
  },
  {
    name:"Exclusionary Rule & Fruit of the Poisonous Tree", anchor:{name:"Mapp v. Ohio", cite:"367 U.S. 643 (1961)", court:"scotus"},
    also:"Wong Sun v. United States, 371 U.S. 471 (1963)", cat:["suppression"],
    kw:"suppress suppression exclude evidence fruit poisonous tree derivative taint",
    summary:"Evidence obtained through an unconstitutional search or seizure is inadmissible in the prosecution's case-in-chief (Mapp), and so is derivative evidence — the fruit of the poisonous tree — unless the connection between the illegality and the evidence has been broken (Wong Sun). Texas layers CCP Art. 38.23 on top: broader than the federal rule (statutory violations count) with a narrower, warrant-only good-faith exception.",
    street:[
      "The tree poisons its fruit: an unlawful stop can sink the consent, the statement, and the contraband that followed it.",
      "In Texas, think 38.23 first — a Chapter 14 defect can suppress even when the Constitution was satisfied.",
      "The saving doctrines (attenuation, independent source, inevitable discovery, good faith) are the exceptions — build cases that don't need them."
    ]
  },
  {
    name:"Good Faith Exception", anchor:{name:"United States v. Leon", cite:"468 U.S. 897 (1984)", court:"scotus"},
    also:"Herring v. United States, 555 U.S. 135 (2009)", cat:["suppression"],
    kw:"good faith warrant reliance magistrate defective invalid database error",
    summary:"Evidence obtained in objectively reasonable reliance on a search warrant later held invalid is not suppressed — the exclusionary rule aims to deter police misconduct, and there is little to deter when officers reasonably relied on a magistrate's determination. Federal law has extended the logic to reasonable reliance on statutes and databases. CRITICAL Texas difference: Art. 38.23(b)'s good-faith exception is far narrower — it requires a warrant issued by a neutral magistrate based on probable cause, and Texas courts do not recognize the broader federal extensions.",
    street:[
      "Leon rewards honest warrant work — a facially valid warrant executed in good faith protects the evidence even if the affidavit is later found lacking.",
      "It does not save bare-bones affidavits, misleading affiants, or warrants so deficient no reasonable officer would rely on them.",
      "In Texas prosecutions, do not count on federal good-faith breadth — 38.23 gives you the warrant version only."
    ]
  },
  {
    name:"Attenuation Doctrine", anchor:{name:"Utah v. Strieff", cite:"579 U.S. 232 (2016)", court:"scotus"},
    also:"Brown v. Illinois, 422 U.S. 590 (1975)", cat:["suppression"],
    kw:"attenuation taint dissipate intervening warrant discovery flagrancy",
    summary:"Evidence is admissible despite an earlier illegality when the connection between the misconduct and the evidence has become sufficiently attenuated. Brown supplies the three factors: temporal proximity between the illegality and the discovery, the presence of intervening circumstances, and — most significantly — the purpose and flagrancy of the official misconduct. In Strieff, discovery of a valid, pre-existing arrest warrant was an intervening circumstance that attenuated an unlawful stop.",
    street:[
      "A rescue doctrine, not a plan — flagrant or purposeful misconduct fails the third factor every time.",
      "The pre-existing warrant is the classic intervening circumstance; a consent obtained minutes after a bad stop usually is not.",
      "Document good faith contemporaneously; attenuation litigation is about what you knew and intended at the time."
    ]
  },
  {
    name:"Inevitable Discovery", anchor:{name:"Nix v. Williams", cite:"467 U.S. 431 (1984)", court:"scotus"},
    also:"", cat:["suppression"],
    kw:"inevitable discovery would have found search party lawful means anyway",
    summary:"Unlawfully obtained evidence is admissible if the prosecution proves by a preponderance that it would inevitably have been discovered by lawful means already in motion — in Nix, a search party was closing on the victim's body when the tainted statement led officers there first. The doctrine requires a demonstrable, ongoing lawful process, not speculation that police could have gotten a warrant.",
    street:[
      "'We could have gotten a warrant' is not inevitability — courts want lawful means actually underway.",
      "Document parallel lawful efforts in real time (the pending warrant application, the ongoing grid search); that record is the doctrine.",
      "Like attenuation, this saves accidents — it does not license shortcuts."
    ]
  },
  {
    name:"Independent Source Doctrine", anchor:{name:"Murray v. United States", cite:"487 U.S. 533 (1988)", court:"scotus"},
    also:"Segura v. United States, 468 U.S. 796 (1984)", cat:["suppression"],
    kw:"independent source warrant untainted separate lawful basis reentry",
    summary:"Evidence initially observed during an unlawful entry is nonetheless admissible if later seized pursuant to a warrant obtained from sources wholly independent of the illegality — the warrant application must neither rely on what the unlawful entry revealed nor be prompted by it. The doctrine puts police in the same position they would have occupied absent the misconduct, no better and no worse.",
    street:[
      "The test is a clean affidavit: strike everything learned in the bad entry — does probable cause still stand on what came before?",
      "Decision evidence matters too: the choice to seek the warrant must predate or be independent of the unlawful look.",
      "Keep pre-entry PC well documented; it is what survives."
    ]
  },
  {
    name:"Collective Knowledge Doctrine", anchor:{name:"United States v. Hensley", cite:"469 U.S. 221 (1985)", court:"scotus"},
    also:"Whiteley v. Warden, 401 U.S. 560 (1971)", cat:["suppression","warrantexc"],
    kw:"collective knowledge bolo flyer bulletin dispatch fellow officer imputed",
    summary:"An officer may act on a bulletin, BOLO, or request from another officer or agency; the stop or arrest is lawful if the issuing source possessed the reasonable suspicion or probable cause to justify it. The knowledge of the law enforcement team is imputed to the acting officer — but if the source lacked the required basis, the acting officer's good faith does not cure it (Whiteley).",
    street:[
      "You can act on the BOLO without knowing the underlying facts — but the case rises or falls on the issuing officer's articulation.",
      "When you issue the bulletin, write your basis contemporaneously; you are underwriting every stop made on it.",
      "Confirm the bulletin's scope: authority to stop is not automatically authority to search."
    ]
  },
  {
    name:"Open Fields Doctrine", anchor:{name:"Oliver v. United States", cite:"466 U.S. 170 (1984)", court:"scotus"},
    also:"Hester v. United States, 265 U.S. 57 (1924)", cat:["scope"],
    kw:"open fields pasture woods fence no trespassing sign land rural",
    summary:"The Fourth Amendment does not protect open fields — undeveloped land beyond the curtilage — even when fenced, posted with no-trespassing signs, and entered in technical trespass. Society recognizes no reasonable expectation of privacy in such areas, so officers' entry and observations there are not searches, though state trespass law and Texas statutes still apply to the officer's conduct as a matter of state law.",
    street:[
      "Constitutionally, the fence and the sign don't create Fourth Amendment protection in a back pasture — but the curtilage line is everything.",
      "Observations from open fields can supply the PC for the warrant that reaches the house and barns.",
      "Remember the state-law layer: civil and criminal trespass rules for officers are a separate question from suppression."
    ]
  },
  {
    name:"Curtilage", anchor:{name:"United States v. Dunn", cite:"480 U.S. 294 (1987)", court:"scotus"},
    also:"Florida v. Jardines, 569 U.S. 1 (2013); Collins v. Virginia, 584 U.S. 586 (2018)", cat:["scope"],
    kw:"curtilage yard porch driveway barn proximity enclosure knock and talk k9 sniff",
    summary:"Curtilage — the area immediately surrounding and associated with the home — receives the home's full Fourth Amendment protection. Dunn's four factors mark it: proximity to the home, whether it lies within an enclosure surrounding the home, the nature of its uses, and steps taken to protect it from observation. Jardines holds a K-9 sniff on the front porch is a search (an implied license permits approaching to knock, not to investigate), and Collins bars using the automobile exception to enter curtilage.",
    street:[
      "The knock-and-talk license is what a Girl Scout has: approach the front door, knock, wait, leave — bringing the dog exceeds it.",
      "Run the four Dunn factors in your report when the line is contestable (detached garages, back porches, fenced side yards).",
      "Plain view from a lawful vantage outside curtilage remains available — position matters."
    ]
  },
  {
    name:"Abandonment Doctrine", anchor:{name:"California v. Greenwood", cite:"486 U.S. 35 (1988)", court:"scotus"},
    also:"Abel v. United States, 362 U.S. 217 (1960)", cat:["scope"],
    kw:"abandoned trash garbage curb discarded tossed denial ownership",
    summary:"Property voluntarily abandoned carries no reasonable expectation of privacy: garbage set out at the curb for collection (Greenwood), items discarded during flight, and property whose ownership the suspect expressly denies may all be examined and seized without a warrant. Abandonment must be voluntary — property discarded as the direct product of unlawful police conduct is analyzed as fruit of that illegality.",
    street:[
      "The toss during a lawful pursuit is abandonment; the toss caused by an unlawful stop is fruit — the lawfulness of your conduct decides which.",
      "'That's not my bag' on camera is a gift: an express disclaimer defeats the later suppression motion.",
      "Curbside trash pulls remain a lawful investigative staple — document that the container was outside the curtilage, at the point of collection."
    ]
  },
  {
    name:"Third-Party Doctrine", anchor:{name:"Smith v. Maryland", cite:"442 U.S. 735 (1979)", court:"scotus"},
    also:"United States v. Miller, 425 U.S. 435 (1976); Carpenter v. United States, 585 U.S. 296 (2018)", cat:["scope"],
    kw:"third party records bank phone subpoena business records csli carpenter",
    summary:"Information voluntarily conveyed to third parties — dialed numbers (Smith), bank records (Miller) — traditionally carries no Fourth Amendment protection, so government acquisition by subpoena or court order is not a search. Carpenter declined to extend the doctrine to seven days or more of historical cell-site location information, holding that the exhaustive chronicle of physical movements requires a warrant, while expressly leaving the traditional applications intact.",
    street:[
      "Business records generally remain subpoena territory; long-term location data is warrant territory — Carpenter is the dividing case.",
      "Real-time tracking, tower dumps, and geofence requests occupy contested ground — route them through your DA and current warrant templates.",
      "Federal statutes (SCA/ECPA) layer their own process requirements on top of the constitutional floor."
    ]
  },
  {
    name:"Community Caretaking (After Caniglia)", anchor:{name:"Cady v. Dombrowski", cite:"413 U.S. 433 (1973)", court:"scotus"},
    also:"Caniglia v. Strom, 593 U.S. 194 (2021)", cat:["scope","warrantexc"],
    kw:"community caretaking vehicle welfare check home caniglia cady limits",
    summary:"Cady recognized that officers perform community-caretaking functions divorced from criminal investigation — there, searching a disabled vehicle for the driver's service revolver — and upheld the vehicle search on that basis. Caniglia holds unanimously that Cady created no standalone exception for warrantless home entries: whatever caretaking latitude exists for vehicles, homes require a warrant, consent, or a recognized exigency such as emergency aid.",
    street:[
      "The phrase 'community caretaking' still works for vehicles (impound, inventory, disabled-vehicle safety); it opens no doors.",
      "On welfare checks at residences, build the emergency-aid facts — that doctrine survived; this shortcut did not.",
      "Update old training materials: pre-2021 caretaking-entry caselaw is no longer reliable."
    ]
  },
  {
    name:"Knock and Announce", anchor:{name:"Wilson v. Arkansas", cite:"514 U.S. 927 (1995)", court:"scotus"},
    also:"Richards v. Wisconsin, 520 U.S. 385 (1997); Hudson v. Michigan, 547 U.S. 586 (2006)", cat:["liability","warrantexc"],
    kw:"knock announce entry warrant execution wait time no-knock",
    summary:"The common-law knock-and-announce principle is part of the Fourth Amendment reasonableness inquiry when executing warrants (Wilson). No-knock entry requires reasonable suspicion that announcing would be dangerous, futile, or would inhibit effective investigation — judged case-by-case, with no blanket exceptions by offense type (Richards). Hudson holds suppression is not the remedy for knock-and-announce violations, but civil liability, agency discipline, and state-law consequences remain fully available.",
    street:[
      "Announce, and give an occupant reasonable time to answer — the wait scales with the circumstances and what's being destroyed.",
      "No-knock justification is articulated in advance and in the affidavit where possible, not invented at the door.",
      "Hudson removed the suppression remedy, not the rule — the § 1983 exposure and policy consequences are real, and Texas agencies face their own statutory constraints."
    ]
  },
  {
    name:"Qualified Immunity", anchor:{name:"Pearson v. Callahan", cite:"555 U.S. 223 (2009)", court:"scotus"},
    also:"Harlow v. Fitzgerald, 457 U.S. 800 (1982); Mullenix v. Luna, 577 U.S. 7 (2015)", cat:["liability"],
    kw:"qualified immunity civil liability clearly established 1983 lawsuit sued",
    summary:"Government officials performing discretionary functions are shielded from civil damages liability unless their conduct violated a constitutional right that was clearly established at the time — meaning existing precedent placed the question beyond debate for a reasonable officer in the same circumstances. Courts may address the two prongs (violation, and clearly established) in either order. The doctrine governs civil suits; it has no bearing on criminal prosecution or evidence suppression.",
    street:[
      "The doctrine protects reasonable judgment calls in gray areas — it does not protect ignoring the cases in this library.",
      "Circuit-specific precedent defines 'clearly established' — which is why the circuit selector on the Case Law tab matters.",
      "QI is a defense to damages, not a permission slip: suppression, discipline, and criminal exposure run on separate tracks."
    ]
  }
];