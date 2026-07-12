const CIRCUITS = [
  { id:"all",  label:"All Circuits + SCOTUS",  states:"nationwide" },
  { id:"ca1",  label:"1st Circuit",  states:"ME, MA, NH, RI, PR" },
  { id:"ca2",  label:"2nd Circuit",  states:"CT, NY, VT" },
  { id:"ca3",  label:"3rd Circuit",  states:"DE, NJ, PA, VI" },
  { id:"ca4",  label:"4th Circuit",  states:"MD, NC, SC, VA, WV" },
  { id:"ca5",  label:"5th Circuit",  states:"LA, MS, TX" },
  { id:"ca6",  label:"6th Circuit",  states:"KY, MI, OH, TN" },
  { id:"ca7",  label:"7th Circuit",  states:"IL, IN, WI" },
  { id:"ca8",  label:"8th Circuit",  states:"AR, IA, MN, MO, NE, ND, SD" },
  { id:"ca9",  label:"9th Circuit",  states:"AK, AZ, CA, HI, ID, MT, NV, OR, WA, GU, MP" },
  { id:"ca10", label:"10th Circuit", states:"CO, KS, NM, OK, UT, WY" },
  { id:"ca11", label:"11th Circuit", states:"AL, FL, GA" },
  { id:"cadc", label:"D.C. Circuit", states:"District of Columbia" },
];

/* ================= CALL TYPE TAXONOMY ================= */
const CALL_TYPES = [
  { id:"traffic",   label:"Traffic Stop",                  hint:"Stops, occupants, duration, pretext" },
  { id:"terry",     label:"Pedestrian / Terry Stop",       hint:"Suspicious person, stop & frisk" },
  { id:"domestic",  label:"Domestic Disturbance",          hint:"Entries, co-occupant consent" },
  { id:"uof",       label:"Use of Force",                  hint:"Deadly & less-lethal force" },
  { id:"pursuit",   label:"Pursuit",                       hint:"Vehicle & foot pursuits" },
  { id:"flee",      label:"Fleeing Suspect",               hint:"Flight, hot pursuit into homes" },
  { id:"consent",   label:"Consent Search",                hint:"Voluntariness, authority, scope" },
  { id:"entry",     label:"Warrantless Home Entry",        hint:"Exigency, emergency aid" },
  { id:"welfare",   label:"Welfare Check",                 hint:"Community caretaking, emergency aid" },
  { id:"arrest",    label:"Arrest / Search Incident",      hint:"SITA, vehicle searches" },
  { id:"interrog",  label:"Custodial Interrogation",       hint:"Miranda, custody, questioning" },
  { id:"digital",   label:"Digital Evidence",              hint:"Phones, location data" },
];

/* court: "scotus" | circuit id (e.g., "ca5") */
const CASES = [
  { name:"Terry v. Ohio", cite:"392 U.S. 1 (1968)", court:"scotus", std:"rs", tags:["terry","arrest"], holding:"An officer may briefly detain a person based on reasonable suspicion, supported by specific and articulable facts, that criminal activity may be afoot — and may conduct a limited pat-down of outer clothing when there is reasonable suspicion the person is armed and dangerous.", street:["Detention and frisk are two separate justifications — articulate each on its own.","A frisk is for weapons only; it is not a search for evidence.","Write the specific facts, not conclusions: what you saw, heard, and knew."] },
  { name:"Graham v. Connor", cite:"490 U.S. 386 (1989)", court:"scotus", std:null, tags:["uof","arrest"], holding:"All claims of excessive force during an arrest, stop, or other seizure are judged under the Fourth Amendment's objective reasonableness standard — from the perspective of a reasonable officer on scene, without 20/20 hindsight — weighing the severity of the crime, the immediacy of the threat, and active resistance or flight.", street:["Document the three Graham factors in every use-of-force report.","Reasonableness is judged at the moment of force, allowing for split-second decisions.","Your subjective intent — good or bad — is not the test."] },
  { name:"Barnes v. Felix", cite:"605 U.S. 73 (2025)", court:"scotus", std:null, tags:["uof","traffic","flee"], holding:"The Supreme Court rejected the Fifth Circuit's \"moment of threat\" doctrine. Courts must evaluate excessive-force claims under the totality of the circumstances, including relevant events leading up to the moment force was used — not only the isolated instant of the threat.", street:["The whole encounter is now on the table — your approach and tactics leading up to force will be reviewed.","Documentation should narrate the full timeline, not just the final seconds.","Pairs with Graham: totality supplies the context in which the Graham factors are weighed."] },
  { name:"Tennessee v. Garner", cite:"471 U.S. 1 (1985)", court:"scotus", std:"pc", tags:["uof","flee","pursuit"], holding:"Deadly force to prevent the escape of a fleeing suspect is unconstitutional unless the officer has probable cause to believe the suspect poses a significant threat of death or serious physical injury to the officer or others.", street:["Flight alone never justifies deadly force.","Articulate the specific threat facts, and give a warning where feasible.","Applies to any means of deadly force, not just firearms."] },
  { name:"Scott v. Harris", cite:"550 U.S. 372 (2007)", court:"scotus", std:null, tags:["pursuit","uof","flee"], holding:"An officer's attempt to terminate a dangerous high-speed vehicle pursuit that threatens the lives of innocent bystanders does not violate the Fourth Amendment, even when it places the fleeing motorist at risk of serious injury or death; the video record can defeat a suspect's contrary account.", street:["The public danger created by the pursuit itself is central to reasonableness.","Preserve the video — courts may credit it over conflicting testimony.","Your pursuit policy may be stricter than the constitutional floor; policy still controls."] },
  { name:"Plumhoff v. Rickard", cite:"572 U.S. 765 (2014)", court:"scotus", std:null, tags:["pursuit","uof","flee"], holding:"Officers did not use excessive force by firing at a driver whose reckless flight posed a grave public-safety risk, and firing multiple rounds is not unreasonable while the threat remains — officers need not stop shooting until the threat has ended.", street:["The number of rounds is judged against whether the threat persisted.","Reassess continuously; document when and why the threat ended.","Read together with Garner and Scott for the vehicle-flight framework."] },
  { name:"Torres v. Madrid", cite:"592 U.S. 306 (2021)", court:"scotus", std:null, tags:["uof","flee"], holding:"The application of physical force to the body of a person with intent to restrain is a Fourth Amendment seizure even if the person escapes — an officer who shoots a fleeing suspect has seized her for that moment even if she gets away.", street:["A 'miss-and-flee' can still generate a seizure claim — report all uses of force, hit or not.","The seizure analysis attaches at the moment force touches the person.","Document force events even when no one is taken into custody."] },
  { name:"County of Los Angeles v. Mendez", cite:"581 U.S. 420 (2017)", court:"scotus", std:null, tags:["uof","entry"], holding:"The Supreme Court rejected the Ninth Circuit's \"provocation rule.\" An objectively reasonable use of force does not become unreasonable because a separate, earlier Fourth Amendment violation (such as an unlawful entry) provoked the confrontation — each claim is analyzed on its own.", street:["Force and entry are analyzed as separate Fourth Amendment questions.","A bad entry can still create liability on its own — get the entry right first.","After Barnes, prior events still inform totality; Mendez bars only automatic bootstrapping."] },
  { name:"Pennsylvania v. Mimms", cite:"434 U.S. 106 (1977)", court:"scotus", std:null, tags:["traffic"], holding:"During a lawful traffic stop, an officer may order the driver out of the vehicle as a matter of course; the intrusion is minimal against the weighty interest in officer safety.", street:["No additional suspicion is needed to have the driver step out.","A frisk after exit still requires its own armed-and-dangerous suspicion (Terry).","Maryland v. Wilson extends this to passengers."] },
  { name:"Maryland v. Wilson", cite:"519 U.S. 408 (1997)", court:"scotus", std:null, tags:["traffic"], holding:"The Mimms rule extends to passengers: an officer making a lawful traffic stop may order passengers out of the car pending completion of the stop.", street:["Applies to every occupant of a lawfully stopped vehicle.","Control of occupants is a safety measure, not a search — frisks still need their own justification."] },
  { name:"Rodriguez v. United States", cite:"575 U.S. 348 (2015)", court:"scotus", std:"rs", tags:["traffic"], holding:"A traffic stop may last no longer than needed to address the violation and attendant safety concerns. Absent independent reasonable suspicion, police may not extend a completed stop — even briefly — to conduct a dog sniff or other unrelated investigation.", street:["The mission of the stop sets the clock: license, warrants, registration, insurance, citation.","Run unrelated tasks in parallel, never in a way that adds time.","To extend the stop, articulate new reasonable suspicion developed during it."] },
  { name:"Whren v. United States", cite:"517 U.S. 806 (1996)", court:"scotus", std:"pc", tags:["traffic"], holding:"A traffic stop is reasonable under the Fourth Amendment where police have probable cause to believe a traffic violation occurred, regardless of the officer's subjective motivation — pretext does not invalidate an objectively justified stop.", street:["The objective violation carries the stop; document it precisely.","Whren does not shield against Equal Protection claims for discriminatory enforcement.","Agency policy on pretext stops may be stricter than the Constitution."] },
  { name:"Illinois v. Wardlow", cite:"528 U.S. 119 (2000)", court:"scotus", std:"rs", tags:["terry","flee"], holding:"Unprovoked, headlong flight from police in a high-crime area can support reasonable suspicion for a Terry stop. Flight is not necessarily indicative of wrongdoing, but it is suggestive of it, and officers may weigh it with the setting.", street:["Flight plus context — not flight alone in the abstract — is the articulation.","Describe the area with specific facts (recent calls, known activity), not labels.","A refusal to cooperate, without flight, does not create suspicion."] },
  { name:"Heien v. North Carolina", cite:"574 U.S. 54 (2014)", court:"scotus", std:"rs", tags:["traffic","terry"], holding:"A stop based on an officer's objectively reasonable mistake of law can still be supported by reasonable suspicion; the Fourth Amendment tolerates reasonable errors of both fact and law.", street:["The mistake must be objectively reasonable — a genuinely ambiguous statute, not a misremembered one.","Know your traffic code; Heien is a narrow safety net, not a substitute for training."] },
  { name:"Utah v. Strieff", cite:"579 U.S. 232 (2016)", court:"scotus", std:null, tags:["terry","arrest"], holding:"Evidence found during a search incident to arrest on a valid, pre-existing arrest warrant is admissible even when the initial stop was unlawful, where the discovery of the warrant attenuates the taint of the stop.", street:["Attenuation is a rescue doctrine for suppression — not permission for bad stops.","Flagrant or purposeful misconduct defeats attenuation.","Build lawful stops first; Strieff addresses the remedy, not your liability exposure."] },
  { name:"Schneckloth v. Bustamonte", cite:"412 U.S. 218 (1973)", court:"scotus", std:"consent", tags:["consent","traffic"], holding:"The voluntariness of consent to search is a question of fact determined from the totality of the circumstances. Knowledge of the right to refuse is a factor, but police need not warn a person of that right for consent to be valid.", street:["Voluntariness factors: age, education, intelligence, custody status, tone of the request, show of authority.","Phrase it as a request and document the exact words used — yours and theirs.","Recorded consent (BWC audio) is your best evidence of voluntariness."] },
  { name:"Florida v. Jimeno", cite:"500 U.S. 248 (1991)", court:"scotus", std:"consent", tags:["consent","traffic"], holding:"The scope of consent is measured by objective reasonableness: what a typical reasonable person would have understood from the exchange. Consent to search a car for drugs reasonably includes containers within it that could hold drugs.", street:["State the object of the search when you ask — it defines the scope.","A suspect may limit or withdraw consent at any time; honor it and document the time.","Breaking open a locked container likely exceeds general consent."] },
  { name:"Illinois v. Rodriguez", cite:"497 U.S. 177 (1990)", court:"scotus", std:"consent", tags:["consent","entry","domestic"], holding:"A warrantless entry is valid when based on the consent of a third party whom police, at the time of entry, reasonably believe possesses common authority over the premises — even if that belief later proves mistaken (apparent authority).", street:["Ask the questions that establish authority: Do you live here? Whose room is this? Whose bag?","Apparent authority must be reasonable on the facts you actually developed.","When authority is ambiguous, stop and clarify — or get a warrant."] },
  { name:"Georgia v. Randolph", cite:"547 U.S. 103 (2006)", court:"scotus", std:"consent", tags:["consent","domestic","entry"], holding:"A physically present co-occupant's express refusal to permit entry renders a warrantless search unreasonable as to him, even when another resident consents. The objector must be present and objecting at the threshold.", street:["Common domestic-call scenario: one party consents, the other refuses at the door — the refusal wins as to shared areas.","Randolph does not bar entry on other grounds (exigency, emergency aid, protective sweep incident to lawful arrest).","Document who was present, who said what, and where each person was standing."] },
  { name:"Fernandez v. California", cite:"571 U.S. 292 (2014)", court:"scotus", std:"consent", tags:["consent","domestic","entry","arrest"], holding:"Randolph's rule applies only while the objector is physically present. When the objecting occupant is removed for reasons that are objectively reasonable — such as a lawful arrest — a remaining co-occupant's later consent is valid.", street:["The removal must be objectively justified on its own; removal to defeat an objection will sink the search.","Domestic-violence arrests are the classic Fernandez fact pattern.","Document the independent basis for the arrest/removal before relying on the remaining party's consent."] },
  { name:"Brigham City v. Stuart", cite:"547 U.S. 398 (2006)", court:"scotus", std:null, tags:["entry","domestic","welfare"], holding:"Police may enter a home without a warrant when they have an objectively reasonable basis to believe an occupant is seriously injured or imminently threatened with such injury. The officers' subjective motives are irrelevant to the emergency-aid analysis.", street:["Articulate what you saw and heard at the scene: the fight, the injury, the cry for help.","The entry's scope is tied to the emergency — render aid, secure the scene, then reassess.","See Case v. Montana (2025) for the current articulation of the required certainty."] },
  { name:"Case v. Montana", cite:"607 U.S. ___ (2026)", court:"scotus", std:null, tags:["entry","welfare","domestic"], holding:"Unanimous, opinion by Justice Kagan. Officers may enter a home without a warrant to render emergency aid when they have an \"objectively reasonable basis for believing\" that an occupant is seriously injured or imminently threatened with such injury — probable cause is NOT required, and the Montana Supreme Court's lower \"reasonable suspicion\"-type community-caretaking standard was also rejected as too permissive. Entry must stay limited to what is reasonably necessary to address the emergency.", street:["You do not need probable cause to enter for a welfare-check emergency — but you need more than a bare hunch; articulate specific, objective facts supporting the belief someone is in danger.","Once inside, stay within the scope of the emergency — this decision does not authorize a broader search of the home.","Pair with Brigham City and Caniglia when documenting any welfare-check entry; Caniglia already forecloses relying on generic \"community caretaking\" alone."] },
  { name:"Caniglia v. Strom", cite:"593 U.S. 194 (2021)", court:"scotus", std:"warrant", tags:["welfare","entry"], holding:"There is no standalone \"community caretaking\" exception permitting warrantless entries into the home. Cady v. Dombrowski's caretaking rationale is limited to vehicles; home entries require a warrant, consent, or a recognized exigency such as emergency aid.", street:["'Community caretaking' is not a magic phrase for crossing a threshold.","On welfare checks, build the emergency-aid facts or get consent / a warrant.","Vehicle caretaking (impound, inventory) survives — homes are different."] },
  { name:"Lange v. California", cite:"594 U.S. 295 (2021)", court:"scotus", std:"warrant", tags:["flee","entry","pursuit"], holding:"Pursuit of a fleeing misdemeanor suspect does not categorically justify warrantless entry into a home. The question is case-by-case: entry is allowed only when a genuine exigency — imminent harm, destruction of evidence, or escape — exists on the facts.", street:["Misdemeanor flight to a doorway is a stop sign, not a green light.","Articulate the specific exigency; the offense grade alone won't carry the entry.","Felony hot pursuit remains on firmer footing, but document the exigency anyway."] },
  { name:"Kentucky v. King", cite:"563 U.S. 452 (2011)", court:"scotus", std:"warrant", tags:["entry"], holding:"The exigent-circumstances rule applies even when police conduct (like knocking on a door) foreseeably prompts the exigency, so long as the officers did not create it by violating or threatening to violate the Fourth Amendment.", street:["A lawful knock-and-talk that triggers sounds of evidence destruction can support entry.","Never threaten an unlawful entry to manufacture the exigency — that forfeits it.","Document the sounds and observations that signaled destruction of evidence."] },
  { name:"Arizona v. Gant", cite:"556 U.S. 332 (2009)", court:"scotus", std:null, tags:["arrest","traffic"], holding:"Police may search a vehicle incident to a recent occupant's arrest only if the arrestee is unsecured and within reaching distance of the passenger compartment, or it is reasonable to believe the vehicle contains evidence of the offense of arrest.", street:["Once the arrestee is cuffed in your unit, the reaching-distance rationale is gone.","For traffic-offense arrests, there is rarely 'evidence of the offense' to find in the car.","Consider the independent bases: probable cause (automobile exception), inventory, consent."] },
  { name:"Miranda v. Arizona", cite:"384 U.S. 436 (1966)", court:"scotus", std:null, tags:["interrog","arrest"], holding:"Statements from custodial interrogation are inadmissible unless the suspect was warned of the rights to silence and counsel and validly waived them. Custody plus interrogation triggers the warning requirement.", street:["Custody + interrogation = warnings. Roadside questioning during an ordinary traffic stop is generally not custody (Berkemer).","Volunteered statements without questioning are not suppressed — document spontaneity.","Once counsel is invoked, questioning stops (Edwards); re-approach rules are strict."] },
  { name:"Riley v. California", cite:"573 U.S. 373 (2014)", court:"scotus", std:"warrant", tags:["digital","arrest"], holding:"Police must generally obtain a warrant before searching the digital contents of a cell phone seized incident to arrest. The data on a phone is qualitatively and quantitatively different from physical items on a person.", street:["Seize and secure the phone; search it on paper (a warrant), not on scene.","Airplane mode or a Faraday bag preserves evidence while you seek the warrant.","Exigency can still justify an immediate search in true emergencies — document it."] },
  { name:"Carpenter v. United States", cite:"585 U.S. 296 (2018)", court:"scotus", std:"warrant", tags:["digital"], holding:"Acquiring seven days or more of historical cell-site location information is a Fourth Amendment search; the government generally needs a warrant supported by probable cause, notwithstanding the third-party doctrine.", street:["Historical CSLI requests go through a warrant, not a court order alone.","Narrow decision by its terms — but treat long-term location data as warrant territory.","Exigent circumstances (kidnapping, active shooter) remain available; document them."] },
  { name:"Barnes v. Felix (on remand)", cite:"152 F.4th 669 (5th Cir. 2025)", court:"ca5", std:null, tags:["uof","traffic","flee"], holding:"On remand applying the Supreme Court's totality-of-the-circumstances standard, the panel (Higginbotham, J.) again granted qualified immunity to Officer Felix, holding the plaintiffs failed to \"raise a dispute of material fact\" on whether the shooting was unreasonable even under the broader standard. The panel relied heavily on Justice Kavanaugh's Barnes concurrence regarding the dangers officers face when a driver flees a traffic stop.", street:["Even under the broader Barnes standard, the Fifth Circuit affords officers substantial deference where a driver flees — this remand result did not change the outcome for this officer.","Now formally reported at 152 F.4th 669 (5th Cir. 2025); the docket and Westlaw parallel (No. 22-20519, 2025 WL 2674139) also identify it.","Read alongside the SCOTUS decision and Graham for the full arc of this case."] },
  { name:"Estevis v. Cantu", cite:"134 F.4th 793 (5th Cir. 2025)", court:"ca5", std:null, tags:["uof"], holding:"After a two-hour high-speed pursuit, officers boxed in Estevis's truck; he rammed a patrol car and drove toward a fence. Officers fired nine shots. The district court granted qualified immunity for shots 1-3 but denied it for shots 4-9. The Fifth Circuit reversed and rendered judgment granting qualified immunity for shots 4-9, holding Estevis failed to show the officers violated clearly established law. The court distinguished Lytle v. Bexar County (fleeing car already \"three or four houses\" away) and found Plumhoff v. Rickard closer — deadly force may be used against a boxed-in suspect who uses a vehicle as a battering ram — with all shots fired within roughly ten seconds, giving officers no fair notice their conduct was unlawful.", street:["A suspect who rams patrol cars and stays in a running vehicle can present a continuing threat; the Fifth Circuit gave officers substantial deference across a ~10-second volley.","Decided on prong two (clearly established law) — the court did not hold the shots were constitutional, only that no precedent put their unlawfulness beyond debate.","Contrast Lytle (car already well down the road) with a Plumhoff-type boxed-in ramming; the factual posture drives the outcome."] },
  { name:"United States v. Gonzalez", cite:"No. 23-10963, 2024 WL 3345762 (5th Cir. July 9, 2024) (unpublished, per curiam)", court:"ca5", std:"rs", tags:["terry","traffic"], holding:"Unpublished and non-precedential. Applying the Rodriguez framework, the panel held traffic-related tasks were complete about 9 minutes 47 seconds into the stop, and that reasonable suspicion — extreme nervousness, an implausible travel story, and travel on a known drug corridor — justified prolonging the stop for a canine sniff. Because this decision is unpublished, it is NOT controlling authority; cite United States v. Pack (5th Cir. 2010) instead for a published application of the same framework.", street:["Do not cite this case as controlling — it is unpublished and non-precedential. Use United States v. Pack for a citable, published Fifth Circuit application of Rodriguez.","The underlying facts (nervousness, inconsistent travel story, known corridor) are still a useful illustration of what supports prolonging a stop — just cite Pack, not this case, in a report or testimony."] },
  { name:"Thompson v. Richter", cite:"No. 24-10837 (5th Cir. 2025)", court:"ca5", std:null, tags:["traffic"], holding:"Troopers stopped Thompson and McChester for speeding, then extended the stop to await a canine sniff; a search and Thompson's arrest followed. The district court granted the troopers qualified immunity, and the Fifth Circuit affirmed. The court held the law was not clearly established that extending the stop under these facts violated the Fourth Amendment, so the troopers were entitled to qualified immunity; it expressly did not decide whether the prolonged detention actually violated the Fourth Amendment. Because the plaintiffs' search and arrest claims depended on the detention being unlawful, the qualified-immunity holding disposed of them as well.", street:["A Rodriguez v. United States problem: authority for a traffic stop ends when the tasks tied to the infraction are (or should be) complete, unless new reasonable suspicion emerges to justify prolonging it for a dog sniff.","The panel resolved this on \"clearly established law\" — it did not bless the extended detention as lawful, only found no precedent gave the troopers fair notice it was unlawful.","Build and document the specific, articulable facts (inconsistent travel stories, nervousness, etc.) before extending a completed stop for a canine."] },
  { name:"Lombardo v. City of St. Louis", cite:"594 U.S. 464 (2021)", court:"scotus", std:null, tags:["uof","arrest"], holding:"Per curiam. Vacated a grant of summary judgment for officers who kept a handcuffed, shackled detainee in a prone position with body-weight pressure on his back for about 15 minutes until he stopped breathing. There is no per se rule that prone restraint of a resisting detainee is constitutional — courts must undertake a careful, context-specific analysis of the force used.", street:["Get a subject off their stomach as soon as they're cuffed and no longer resisting — prolonged prone restraint with body-weight pressure is dangerous and draws serious legal scrutiny.","Duration, whether the person was already handcuffed/shackled, and known asphyxia risk are all part of the reasonableness analysis.","This case is cited constantly in prone-restraint and in-custody-death litigation — know it."] },
  { name:"Kingsley v. Hendrickson", cite:"576 U.S. 389 (2015)", court:"scotus", std:null, tags:["uof","arrest"], holding:"For a pretrial detainee's excessive-force claim under the Fourteenth Amendment, the standard is objective reasonableness, not whether the officer subjectively intended to punish. Relevant factors include the relationship between the need for force and the force used, the extent of injury, and any effort to temper the force applied.", street:["Applies to force used on someone already in custody awaiting trial (jail/booking), not on-street encounters — know which standard applies where.","Your subjective good intentions don't save an objectively excessive use of force on a detainee.","Document any effort made to temper or limit the force used — it cuts in your favor under this standard."] },
  { name:"Nieves v. Bartlett", cite:"587 U.S. 391 (2019)", court:"scotus", std:"pc", tags:["arrest"], holding:"Probable cause generally defeats a First Amendment retaliatory-arrest claim, even if the officer was subjectively motivated by the arrestee's protected speech. A narrow exception applies where officers typically exercise discretion not to arrest for the offense in question but made an exception for this plaintiff.", street:["An arrest backed by real probable cause is usually a complete defense to a claim that you arrested someone in retaliation for what they said.","The exception matters most for minor, rarely-enforced offenses — if you're citing something almost never charged, expect a retaliation claim to survive.","Document the probable cause independent of anything the person said that you didn't like."] },
  { name:"Vega v. Tekoh", cite:"597 U.S. 134 (2022)", court:"scotus", std:null, tags:["interrog"], holding:"A Miranda violation, standing alone, is not a deprivation of a constitutional right actionable under 42 U.S.C. § 1983. Miranda is a prophylactic, judicially-created rule; its remedy is suppression of the statement, not civil damages.", street:["Failing to Mirandize before custodial interrogation can still cost you the statement at trial, but it does not by itself expose you to a civil-rights damages suit.","A separate, actually-coerced confession (not just a missed warning) can still support other constitutional claims.","This does not relax the warning requirement — it only narrows the civil remedy for skipping it."] },
  { name:"Egbert v. Boule", cite:"596 U.S. 482 (2022)", court:"scotus", std:null, tags:["uof","arrest"], holding:"Declined to extend Bivens (implied damages remedies for constitutional violations by federal officers) to a Fourth Amendment excessive-force claim and a First Amendment retaliation claim against a Border Patrol agent. Federal officers now face very limited individual damages exposure for constitutional torts in new contexts.", street:["Applies to federal officers (e.g., Border Patrol, federal task force members) — state and local officers remain subject to § 1983, which this case does not touch.","Federal officers' practical civil damages exposure for new-context constitutional claims is now quite limited post-Egbert."] },
  { name:"Rivas-Villegas v. Cortesluna", cite:"595 U.S. 1 (2021)", court:"scotus", std:null, tags:["uof","domestic"], holding:"Per curiam. An officer who briefly knelt on the back of an armed domestic-violence suspect during handcuffing was entitled to qualified immunity — the plaintiff could not identify a case with sufficiently similar facts clearly establishing the conduct was unlawful.", street:["Qualified immunity protects unless existing precedent squarely put you on notice that materially similar conduct was unconstitutional — general excessive-force principles aren't enough for a plaintiff to overcome it.","Briefly kneeling on the back of a resisting, armed subject during cuffing was not clearly established as unlawful on these facts."] },
  { name:"City of Tahlequah v. Bond", cite:"595 U.S. 9 (2021)", court:"scotus", std:null, tags:["uof"], holding:"Per curiam. Officers who shot a man advancing toward them with a raised hammer were entitled to qualified immunity. 'Clearly established law' must not be defined at a high level of generality — the plaintiff must point to a case with closely analogous facts.", street:["A subject closing distance with a weapon raised is a recurring fact pattern courts treat as justifying deadly force absent closely on-point precedent to the contrary.","General deadly-force principles ('don't shoot people who aren't an immediate threat') are too generic to defeat qualified immunity — the facts have to line up with an existing case."] },
  { name:"Gonzalez v. Trevino", cite:"602 U.S. 653 (2024)", court:"scotus", std:"pc", tags:["arrest"], holding:"Per curiam. Vacated a Fifth Circuit ruling that had required a retaliatory-arrest plaintiff invoking the Nieves exception to produce a 'virtually identical and identifiable' comparator showing similarly-situated people who weren't arrested. The evidence supporting the exception need only be objective, not that narrow.", street:["The Fifth Circuit's stricter comparator requirement is no longer good law — a retaliatory-arrest plaintiff has an easier path than that circuit had required.","Still requires objective evidence that others engaging in similar conduct were not arrested — just not an 'identical' match."] },
  { name:"Villarreal v. City of Laredo", cite:"94 F.4th 374 (5th Cir. 2024) (en banc)", court:"ca5", std:null, tags:["arrest"], holding:"9-7 en banc decision. Granted qualified immunity to officials who arrested a citizen-journalist under a rarely-used Texas statute (soliciting nonpublic information from a public servant) after she confirmed information with a police source and published it. The en banc majority held the arrest was not 'obviously unconstitutional' and that no precedent clearly established the right. Four separate dissents were filed.", street:["Illustrates how narrowly the Fifth Circuit reads 'clearly established law' — near-identical precedent is generally expected, not just a close analogy.","The underlying statute here had essentially never been used to arrest anyone in over two decades — rarity of enforcement is a fact worth documenting when relying on an obscure statute.","Read together with Villarreal v. Alaniz (below) for the full procedural history, including the Supreme Court's eventual denial of certiorari."] },
  { name:"Villarreal v. Alaniz", cite:"607 U.S. ___ (2026)", court:"scotus", std:null, tags:["arrest"], holding:"Certiorari denied, March 23, 2026, with Justice Sotomayor dissenting. This was Villarreal's second trip to the Supreme Court — the Court had previously vacated and remanded the Fifth Circuit's earlier ruling in light of Gonzalez v. Trevino, but the en banc Fifth Circuit reached the same qualified-immunity result on remand. The Court declined to take the case up again; Sotomayor's dissent called the arrest a 'blatant First Amendment violation.'", street:["A cert denial is not a ruling on the merits — the underlying Fifth Circuit qualified-immunity holding in Villarreal v. City of Laredo remains the operative law of the circuit.","Sotomayor's dissent is a useful signal of where at least some Justices see this issue heading, but it carries no precedential weight on its own.","The case's long procedural history (GVR after Gonzalez v. Trevino, same result on remand, cert denied) shows just how much qualified immunity can insulate an arrest even after the Supreme Court signals concern."] },
  { name:"Chatrie v. United States", cite:"609 U.S. ___ (2026)", court:"scotus", std:"warrant", tags:["digital"], holding:"6-3, opinion by Justice Kagan. Extended Carpenter to geofence 'Location History' data: an individual has a legitimate expectation of privacy in the information Google's Location History service collects about their own phone's movements, so acquiring that data is a Fourth Amendment search — even for a period as short as about two hours. The Court left the good-faith/exclusionary-rule question for the Fourth Circuit to resolve on remand, and did not decide whether geofence warrants themselves are constitutional.", street:["Accessing Google geofence/Location History data is now a Fourth Amendment search nationwide — get a warrant, and don't treat short time windows as exempt.","This resolves the search question only; whether a given geofence warrant satisfies probable cause and particularity is still being worked out circuit by circuit.","Pairs directly with Carpenter — same third-party-doctrine logic, extended from historical cell-site records to geofence location pulls."] },
  { name:"United States v. Smith", cite:"110 F.4th 817 (5th Cir. 2024)", court:"ca5", std:"warrant", tags:["digital"], holding:"Held that geofence warrants — compelling Google to search its entire Location History/'Sensorvault' database for a given area and time window — are Fourth Amendment searches and categorically unconstitutional as 'modern-day general warrants' lacking particularity. The evidence was nonetheless admitted under the Leon good-faith exception.", street:["In this circuit, geofence warrants have been treated as unconstitutional general warrants — don't assume a broad 'search everyone near this location' request will hold up.","Evidence obtained under a since-invalidated geofence warrant may still come in under the good-faith exception, but don't rely on that to justify the warrant application itself.","The Supreme Court's Chatrie decision confirms geofence data acquisitions are searches nationwide, consistent with the direction of this circuit's ruling."] },
  { name:"United States v. Chatrie", cite:"136 F.4th 100 (4th Cir. 2025) (en banc)", court:"ca4", std:null, tags:["digital"], holding:"En banc, one-sentence per curiam affirming the district court, with the court dividing evenly 7-7 on whether a Fourth Amendment search occurred in the acquisition of geofence Location History data. Of the seven judges who found a search occurred, most also concluded the good-faith exception to the exclusionary rule applied. The Supreme Court later resolved the search question in Chatrie's favor (see above).", street:["This even split shows how unsettled geofence law was before the Supreme Court's 2026 Chatrie decision — that decision now controls the search question nationwide.","The exclusionary-rule/good-faith question this court split on remains open on remand from the Supreme Court."] },
  { name:"Cole v. Carson", cite:"935 F.3d 444 (5th Cir. 2019) (en banc)", court:"ca5", std:null, tags:["uof"], holding:"Where material facts are genuinely disputed — for example, whether a suicidal teenager pointed a gun at officers, or whether a warning was given before deadly force — a jury, not the court, must resolve them; denial of qualified immunity was affirmed. Emphasizes that giving a warning before deadly force, where feasible, is a critical component of the reasonableness analysis.", street:["Give a warning before deadly force when it's feasible to do so — courts treat this as a key reasonableness factor.","Disputed facts about what the suspect was actually doing at the moment of the shooting go to a jury, not to summary judgment — thorough, contemporaneous documentation matters more, not less, when facts are contested."] },
  { name:"Argueta v. Jaradi", cite:"86 F.4th 1084 (5th Cir. 2023)", court:"ca5", std:null, tags:["uof","flee"], holding:"Panel granted qualified immunity to an officer who shot a fleeing suspect. A vigorous dissent from denial of rehearing en banc argued the panel had overlooked genuinely disputed material facts. Illustrates this circuit's fact-specific, officer-protective application of qualified immunity in shooting cases.", street:["Reflects the Fifth Circuit's general pattern of resolving close factual disputes in favor of qualified immunity for officers in fleeing-suspect shootings.","The strong dissent signals this area of law is contested even within the circuit — don't assume every fleeing-suspect shooting will be treated the same way on similar facts elsewhere."] },
  { name:"United States v. Pack", cite:"612 F.3d 341 (5th Cir. 2010), modified on reh'g, 622 F.3d 383 (5th Cir. 2010)", court:"ca5", std:"rs", tags:["traffic","terry"], holding:"The leading published Fifth Circuit authority applying Rodriguez: reasonable suspicion — extreme nervousness, conflicting stories between occupants, travel on a known drug corridor, combined with officer experience — permits detaining a driver beyond the traffic stop's original mission (here, to conduct a canine sniff). This remains the go-to published circuit case for what facts justify prolonging a stop.", street:["This is the case to cite for prolonging a stop for a K-9 — not United States v. Gonzalez (below), which is unpublished and non-precedential.","Extreme nervousness alone rarely carries a stop; combine it with inconsistent stories, a known-corridor factor, and articulate your training/experience basis for each observation.","Document the exact timeline: when the traffic mission ended, and precisely what new facts developed before you extended the stop."] },
  { name:"United States v. Nora", cite:"No. 12-50485 (9th Cir. Aug. 28, 2014)", court:"ca9", std:"warrant", tags:["entry","arrest"], holding:"Officers surrounded a home and, after a standoff, used a loudspeaker to order the occupant out at gunpoint; he complied and was arrested in the yard. Held: physically taking a suspect into custody outside the home does not avoid Payton v. New York when it was accomplished only by surrounding the house and ordering the person out — that is an in-home arrest requiring a warrant or an exception. No exigency existed here (the underlying offense was a misdemeanor, and the house was fully surrounded with no realistic chance of escape). Evidence from the pat-down search and the post-arrest statements was suppressed as fruit of the unlawful arrest, and the search warrant for the home was invalidated because the untainted remaining evidence did not support probable cause for most of what it authorized.", street:["\"Surround the house and order them out\" is legally an in-home arrest under Payton, even though the handcuffs go on in the yard — get a warrant or make sure a real exception applies first.","A misdemeanor charge alone will rarely support the exigency needed to skip the warrant — this court called that combination the deciding factor.","This is a Ninth Circuit (California) decision — persuasive, not binding, in Texas, Louisiana, or Mississippi, but the underlying Payton \"constructive in-home arrest\" doctrine is a Supreme Court rule that applies nationwide, so the reasoning is worth knowing regardless of circuit.","A warrant built partly on tainted evidence isn't automatically void — but here, once the tainted evidence was stripped out, what remained didn't support the broad firearms search the warrant authorized."] },
  {
    name:"Atwater v. City of Lago Vista", cite:"532 U.S. 318 (2001)", court:"scotus", std:"pc", tags:["traffic","arrest"],
    holding:"The Fourth Amendment does not forbid a warrantless custodial arrest for a minor criminal offense punishable only by a fine. If an officer has probable cause to believe a person has committed even a very minor criminal offense in his presence, he may arrest without violating the Fourth Amendment. The case arose from a Texas seatbelt arrest.",
    street:[
      "The Fourth Amendment ALLOWS a custodial arrest on a fine-only offense — it does not require one, and it does not override state law.",
      "TEXAS LIMITS THIS: Transp. Code § 543.004 MANDATES release on a written notice to appear for three offences — speeding, texting while driving (§ 545.4251), and open container (§ 49.031). Atwater does not authorize what the Legislature has forbidden.",
      "Check the specific statute before you book on a fine-only offense. Constitutional does not mean lawful under Texas law."
    ]
  },
  {
    name:"Chimel v. California", cite:"395 U.S. 752 (1969)", court:"scotus", std:"pc", tags:["arrest","entry"],
    holding:"A search incident to arrest is limited to the arrestee's person and the area within his immediate control — the space from which he might grab a weapon or destructible evidence. It does not authorize a top-to-bottom search of the house.",
    street:[
      "Arm's reach, at the moment of the arrest. Not the next room, not the whole house.",
      "Want more than that inside a home? Get a warrant, or articulate a separate exception (sweep, exigency, consent).",
      "Read with Buie (protective sweep) and Gant (vehicles) — each is a different, narrower authority."
    ]
  },
  {
    name:"Payton v. New York", cite:"445 U.S. 573 (1980)", court:"scotus", std:"warrant", tags:["entry","arrest"],
    holding:"Absent consent or exigent circumstances, police may not make a warrantless, nonconsensual entry into a suspect's home to make a routine felony arrest. An arrest warrant, founded on probable cause, implicitly carries the limited authority to enter a dwelling in which the suspect lives when there is reason to believe he is within.",
    street:[
      "An ARREST warrant lets you into the suspect's OWN home, if you reasonably believe he is inside.",
      "It does not let you into someone else's home to look for him — that needs a search warrant (Steagald).",
      "No warrant, no consent, no exigency = no entry. The threshold is the line."
    ]
  },
  {
    name:"Maryland v. Buie", cite:"494 U.S. 325 (1990)", court:"scotus", std:"rs", tags:["entry","arrest"],
    holding:"During an in-home arrest, officers may as a precaution and without any suspicion look in closets and spaces immediately adjoining the place of arrest from which an attack could be launched. A broader protective sweep requires a reasonable belief, based on specific and articulable facts, that the area harbors an individual posing a danger.",
    street:[
      "Two tiers: (1) immediately adjoining spaces — no suspicion needed; (2) anywhere else — articulable facts that someone dangerous is there.",
      "A sweep is a cursory look for PEOPLE, not a search for evidence. You may not open drawers.",
      "It lasts only as long as needed to dispel the danger. Say what made you think a person was there."
    ]
  },
  {
    name:"Michigan v. Long", cite:"463 U.S. 1032 (1983)", court:"scotus", std:"rs", tags:["traffic","terry"],
    holding:"Officers may search the passenger compartment of a vehicle, limited to areas where a weapon may be placed or hidden, when they possess a reasonable belief based on specific and articulable facts that the suspect is dangerous and may gain immediate control of a weapon. In effect, a Terry frisk of the car.",
    street:[
      "This is a frisk of the CAR, not a search for evidence. Weapons only, places a weapon could be.",
      "You need articulable facts the person is dangerous AND could reach the weapon — including on return to the car.",
      "Anything found in plain view during a lawful Long frisk is seizable. Do not go beyond weapon-sized spaces."
    ]
  },
  {
    name:"Minnesota v. Dickerson", cite:"508 U.S. 366 (1993)", court:"scotus", std:"rs", tags:["terry","arrest"],
    holding:"If, during a lawful Terry patdown, an officer feels an object whose contour or mass makes its identity as contraband immediately apparent, he may seize it — the 'plain feel' doctrine. But continued exploration, squeezing, or manipulating a pocket after concluding the object is not a weapon exceeds Terry and the seizure is unlawful.",
    street:[
      "'Immediately apparent' means immediately. The moment you decide it is not a weapon and keep feeling, you are done.",
      "Squeezing, sliding, rolling it between your fingers to figure out what it is = an unlawful search.",
      "Articulate what you felt and why it was instantly recognizable as contraband."
    ]
  },
  {
    name:"Carroll v. United States", cite:"267 U.S. 132 (1925)", court:"scotus", std:"pc", tags:["traffic","arrest"],
    holding:"The automobile exception: because a vehicle is readily mobile, officers with probable cause to believe it contains contraband or evidence of a crime may search it without a warrant. The search may extend to any part of the vehicle and any container within it that could hold the object of the search.",
    street:[
      "Probable cause replaces the warrant — but you still need the probable cause. Articulate it.",
      "Scope follows the object: PC for a stolen TV does not open the glovebox. PC for drugs opens almost everything.",
      "The car must be readily mobile. Collins v. Virginia: this does NOT let you walk onto the curtilage of a home to search a vehicle parked there."
    ]
  },
  {
    name:"Illinois v. Caballes", cite:"543 U.S. 405 (2005)", court:"scotus", std:"rs", tags:["traffic","consent"],
    holding:"A dog sniff of the exterior of a vehicle during a lawful traffic stop is not a Fourth Amendment search, and requires no independent suspicion — so long as it does not unreasonably prolong the stop.",
    street:[
      "No reasonable suspicion needed for the sniff itself. But the CLOCK is the whole ballgame.",
      "Read with Rodriguez: you may not extend the stop by even a de minimis amount to run the dog.",
      "If the dog is not there when the mission is done, the stop is over. Let him go or develop independent RS."
    ]
  },
  {
    name:"Florida v. Jardines", cite:"569 U.S. 1 (2013)", court:"scotus", std:"warrant", tags:["entry"],
    holding:"Taking a drug-detection dog onto the front porch of a home to sniff for narcotics is a Fourth Amendment search. The implied license that lets any visitor approach the door and knock does not include bringing a trained dog there to hunt for evidence.",
    street:[
      "A dog at a car window is not a search (Caballes). A dog on the porch IS. The curtilage is the difference.",
      "You may knock and talk — anyone may do that. You may not bring the dog up to the door to investigate.",
      "Objective test: it is about what the officer physically did on the curtilage, not what he was thinking."
    ]
  },
  {
    name:"Brendlin v. California", cite:"551 U.S. 249 (2007)", court:"scotus", std:"rs", tags:["traffic","terry"],
    holding:"When police make a traffic stop, a passenger — not just the driver — is seized for Fourth Amendment purposes and may therefore challenge the constitutionality of the stop.",
    street:[
      "Everyone in the car is seized. A passenger has standing to attack YOUR reason for the stop.",
      "That means a bad stop taints what you find on the passenger too, not just the driver.",
      "It also means passengers are lawfully detained — you can require them to stay (Maryland v. Wilson)."
    ]
  },
  {
    name:"Arizona v. Johnson", cite:"555 U.S. 323 (2009)", court:"scotus", std:"rs", tags:["traffic","terry"],
    holding:"During a lawful traffic stop, an officer may frisk a passenger for weapons if he has reasonable suspicion that the passenger is armed and dangerous. Questioning a passenger about matters unrelated to the stop does not convert it into an unlawful seizure, so long as it does not measurably extend the stop's duration.",
    street:[
      "A frisk of a passenger needs its OWN reasonable suspicion that THAT person is armed and dangerous.",
      "Being a passenger in a stopped car is not, by itself, a reason to frisk anyone.",
      "You may ask unrelated questions — but not if they add time. Rodriguez still governs the clock."
    ]
  },
  {
    name:"Knowles v. Iowa", cite:"525 U.S. 113 (1998)", court:"scotus", std:"pc", tags:["traffic","arrest"],
    holding:"An officer who issues a citation instead of making an arrest may not conduct a full search of the vehicle incident to that citation. The rationales for search incident to arrest — officer safety and evidence preservation — do not carry over to a citation.",
    street:[
      "Cite-and-release does NOT give you a search incident to arrest. No arrest, no SITA.",
      "You still have: a Long frisk of the car with articulable danger, plain view, consent, or the automobile exception with PC.",
      "If you want the search, you need a real basis for it — not just the ticket in your hand."
    ]
  },
  {
    name:"Kyllo v. United States", cite:"533 U.S. 27 (2001)", court:"scotus", std:"warrant", tags:["entry","digital"],
    holding:"Using a device not in general public use to explore details of a home that would previously have been unknowable without physical intrusion is a search, and is presumptively unreasonable without a warrant. Thermal imaging of a home is such a search.",
    street:[
      "Sense-enhancing technology aimed at the inside of a home = a search. Get a warrant.",
      "The rule keys on the HOME. The same tech pointed at a warehouse or a car is a different analysis.",
      "Cited constantly by analogy for new tech. When in doubt about a novel sensor and a house — warrant."
    ]
  },
  {
    name:"Schmerber v. California", cite:"384 U.S. 757 (1966)", court:"scotus", std:"pc", tags:["traffic","arrest"],
    holding:"A compelled blood draw is a Fourth Amendment search of the person. It was upheld here on exigency: an accident, time spent investigating and transporting, and alcohol dissipating from the blood. It is not a blanket rule.",
    street:[
      "The foundation for every blood-draw case since. Read it WITH McNeely — Schmerber is fact-bound, not a per se rule.",
      "The exigency was the crash plus the delay, not just the alcohol burning off.",
      "Blood is a search of the BODY. Treat it that way."
    ]
  },
  {
    name:"Missouri v. McNeely", cite:"569 U.S. 141 (2013)", court:"scotus", std:"warrant", tags:["traffic","arrest"],
    holding:"The natural dissipation of alcohol in the bloodstream does not, by itself, create a per se exigency justifying a warrantless blood draw. Whether one exists is decided case by case on the totality of the circumstances.",
    street:[
      "'The alcohol is burning off' is NOT an exigency by itself. That argument is dead.",
      "If you can reasonably get a warrant, get one. Telephonic and electronic warrants are why the Court expects it.",
      "Document what actually stopped you from getting a warrant — time, distance, manpower, the scene."
    ]
  },
  {
    name:"Birchfield v. North Dakota", cite:"579 U.S. 438 (2016)", court:"scotus", std:"pc", tags:["traffic","arrest"],
    holding:"A DWI arrest, standing alone, justifies a warrantless BREATH test as a search incident to arrest — but not a warrantless BLOOD test. Blood is more intrusive and yields a preservable sample.",
    street:[
      "Breath: yes, incident to arrest. Blood: NO — get a warrant or a real exception.",
      "A State may not make it a crime to refuse a warrantless BLOOD test. It may criminalise refusing a breath test.",
      "Implied consent does not equal Fourth Amendment consent to a needle."
    ]
  },
  {
    name:"Mitchell v. Wisconsin", cite:"588 U.S. 840 (2019)", court:"scotus", std:"pc", tags:["traffic"],
    holding:"Plurality: when a drunk-driving suspect is unconscious and cannot be given a breath test, exigent circumstances will generally permit a warrantless blood draw — because BAC evidence is dissipating and the medical emergency creates competing, pressing demands.",
    street:[
      "Unconscious driver + no breath test possible = usually exigent. But it is a presumption, not a licence.",
      "It did NOT overrule McNeely. A conscious suspect in a routine DWI still means: get a warrant.",
      "Say why you could not get a warrant — the hospital, the scene, the manpower."
    ]
  },
  {
    name:"Michigan Dept. of State Police v. Sitz", cite:"496 U.S. 444 (1990)", court:"scotus", std:null, tags:["traffic"],
    holding:"Brief, suspicionless stops at a properly conducted sobriety checkpoint are reasonable under the Fourth Amendment; the State's interest in combating drunk driving outweighs the slight intrusion.",
    street:[
      "NOTE FOR TEXAS: Texas does NOT authorise DWI checkpoints. Sitz permits them federally; Texas courts have not.",
      "Do not rely on this to run a checkpoint here. Know your agency's policy and Texas law first.",
      "A checkpoint aimed at general crime control is unconstitutional anyway (Edmond)."
    ]
  },
  {
    name:"City of Indianapolis v. Edmond", cite:"531 U.S. 32 (2000)", court:"scotus", std:null, tags:["traffic"],
    holding:"A vehicle checkpoint whose primary purpose is general crime control — here, narcotics interdiction — is unconstitutional. Checkpoints must serve a purpose beyond the ordinary detection of criminal wrongdoing.",
    street:[
      "A roadblock to find drugs is unconstitutional. A roadblock for DWI or the border is a different analysis.",
      "The PRIMARY PURPOSE is what the court examines. Do not dress up a drug checkpoint as a licence check."
    ]
  },
  {
    name:"Delaware v. Prouse", cite:"440 U.S. 648 (1979)", court:"scotus", std:"rs", tags:["traffic"],
    holding:"Officers may not stop a vehicle at random, with no reasonable suspicion, merely to check the driver's licence and registration.",
    street:[
      "No random stops 'just to check the paperwork.' You need reasonable suspicion or a legitimate checkpoint.",
      "A hunch about the car or the neighbourhood is not reasonable suspicion. Say what you SAW."
    ]
  },
  {
    name:"Rhode Island v. Innis", cite:"446 U.S. 291 (1980)", court:"scotus", std:null, tags:["interrog","arrest"],
    holding:"For Miranda purposes, 'interrogation' means express questioning OR any words or actions by police that they should know are reasonably likely to elicit an incriminating response. It focuses on the perceptions of the suspect, not the intent of the officer.",
    street:[
      "You do not have to ask a question to 'interrogate.' A remark designed to get a reaction counts.",
      "The test is what YOU should have known would draw a response — not what you meant.",
      "Spontaneous, unprompted statements are not the product of interrogation. Document that they were unprompted."
    ]
  },
  {
    name:"New York v. Quarles", cite:"467 U.S. 649 (1984)", court:"scotus", std:null, tags:["interrog","arrest"],
    holding:"There is a public-safety exception to Miranda. Where there is an objectively reasonable need to protect the police or the public from an immediate danger — here, a gun hidden in a supermarket — an officer may ask questions directed at that danger before giving warnings, and the answers are admissible.",
    street:[
      "'Where's the gun?' before Miranda is fine when there is a real, immediate danger. Narrow and specific.",
      "It is limited to neutralising the threat. The moment you shift to building the case, warn him.",
      "It is OBJECTIVE — you do not have to be thinking about safety, but the facts must show the danger."
    ]
  },
  {
    name:"Davis v. United States", cite:"512 U.S. 452 (1994)", court:"scotus", std:null, tags:["interrog"],
    holding:"A suspect must invoke the right to counsel unambiguously. If a reasonable officer would understand only that the suspect MIGHT want a lawyer, questioning need not stop, and officers are not required to ask clarifying questions.",
    street:[
      "'Maybe I should get a lawyer' is not an invocation. 'I want a lawyer' is.",
      "You are not REQUIRED to clarify — but clarifying is the safer practice, and it protects the statement.",
      "Once he clearly asks for counsel, stop. Do not talk him out of it."
    ]
  },
  {
    name:"Berghuis v. Thompkins", cite:"560 U.S. 370 (2010)", court:"scotus", std:null, tags:["interrog"],
    holding:"Silence alone does not invoke the right to remain silent. A suspect must invoke it unambiguously. And a suspect who understands his rights and then makes an uncoerced statement has waived them by his conduct.",
    street:[
      "Sitting silent for hours is not an invocation. He has to SAY he is invoking.",
      "A single incriminating answer after a knowing waiver is admissible even after long silence.",
      "Get the waiver clean and on record anyway. TEXAS: CCP Art. 38.22 imposes recording rules Miranda does not."
    ]
  },
  {
    name:"Illinois v. Perkins", cite:"496 U.S. 292 (1990)", court:"scotus", std:null, tags:["interrog"],
    holding:"Miranda warnings are not required when a suspect who is unaware that he is speaking to a law enforcement officer gives a voluntary statement — an undercover agent in a jail cell. The coercive atmosphere Miranda guards against is absent.",
    street:[
      "No warnings needed for an undercover or a jailhouse informant, because there is no police-dominated pressure.",
      "It changes once he is charged — the Sixth Amendment right to counsel is a separate rule.",
      "Voluntariness still matters. Coercion by anyone can sink the statement."
    ]
  },
  {
    name:"Harris v. New York", cite:"401 U.S. 222 (1971)", court:"scotus", std:null, tags:["interrog"],
    holding:"A statement taken in violation of Miranda, but otherwise voluntary, may be used to impeach the defendant's credibility if he takes the stand and testifies inconsistently — though not in the prosecution's case in chief.",
    street:[
      "A Miranda-defective but VOLUNTARY statement is not worthless — it can impeach him if he testifies.",
      "A statement that was actually COERCED is worthless for everything. Voluntariness is the line.",
      "Do not treat this as a reason to skip warnings. You lose the case in chief."
    ]
  },
  {
    name:"J.D.B. v. North Carolina", cite:"564 U.S. 261 (2011)", court:"scotus", std:null, tags:["interrog"],
    holding:"A child's age is a relevant factor in the Miranda custody analysis when it was known to the officer or objectively apparent. A juvenile may reasonably feel he is not free to leave in circumstances where an adult would not.",
    street:[
      "Age counts in the custody test. A 13-year-old in a closed school office may be in custody when an adult would not be.",
      "It is objective — you do not have to guess at his maturity, only account for the age you knew or could see.",
      "When it is a juvenile, the safer course is to warn."
    ]
  },
  {
    name:"Illinois v. Gates", cite:"462 U.S. 213 (1983)", court:"scotus", std:"pc", tags:["arrest","entry"],
    holding:"Probable cause is judged on the totality of the circumstances, not a rigid two-pronged test. An informant's veracity, reliability, and basis of knowledge are relevant and interlocking factors — a deficiency in one can be compensated by a strong showing of another, or by corroboration. Probable cause means a fair probability, not a certainty.",
    street:[
      "Corroborate the tip. Independent police work is what turns an anonymous letter into probable cause.",
      "You do not need to prove the informant is reliable AND how he knows — a strong showing on one can carry a weak one on the other.",
      "'Fair probability.' Not proof, not more likely than not. But more than a hunch."
    ]
  },
  {
    name:"Franks v. Delaware", cite:"438 U.S. 154 (1978)", court:"scotus", std:"warrant", tags:["entry","arrest"],
    holding:"If a defendant shows that the affiant knowingly and intentionally, or with reckless disregard for the truth, included a false statement in a warrant affidavit — and the false statement was necessary to probable cause — the warrant is voided and the fruits suppressed.",
    street:[
      "Do not overstate. Do not omit what cuts against you. A reckless affidavit gets the whole warrant thrown out.",
      "This is the case they use to attack YOUR affidavit. Write it like it will be read line by line, because it will be.",
      "An honest mistake is not a Franks violation. A knowing or reckless falsehood is."
    ]
  },
  {
    name:"United States v. Leon", cite:"468 U.S. 897 (1984)", court:"scotus", std:"warrant", tags:["entry","arrest"],
    holding:"Evidence obtained by officers acting in objectively reasonable, good-faith reliance on a search warrant later found to lack probable cause is not subject to the federal exclusionary rule.",
    street:[
      "Federal good-faith exception for a defective WARRANT. It does not save a warrantless search.",
      "It does not apply if the affidavit was so lacking that no reasonable officer would rely on it, or if you misled the magistrate.",
      "TEXAS IS NARROWER: CCP Art. 38.23(b) has only a limited good-faith exception. Do not assume Leon saves you in state court."
    ]
  },
  {
    name:"Mapp v. Ohio", cite:"367 U.S. 643 (1961)", court:"scotus", std:null, tags:["entry","arrest"],
    holding:"The Fourth Amendment exclusionary rule applies to the States through the Fourteenth Amendment. Evidence obtained by an unconstitutional search or seizure is inadmissible in state court.",
    street:[
      "This is why an unlawful search costs you the case, not just a reprimand.",
      "TEXAS GOES FURTHER: CCP Art. 38.23 excludes evidence obtained in violation of ANY law — including by private citizens."
    ]
  },
  {
    name:"Hudson v. Michigan", cite:"547 U.S. 586 (2006)", court:"scotus", std:"warrant", tags:["entry"],
    holding:"Violation of the knock-and-announce rule does not require suppression of the evidence found inside. The interests protected by knock-and-announce have nothing to do with the seizure of the evidence.",
    street:[
      "A knock-and-announce violation will not, by itself, suppress the evidence in federal court.",
      "That is NOT permission to stop knocking. It is still a Fourth Amendment requirement, and it is still a civil-liability and policy problem.",
      "TEXAS: Art. 38.23 is broader than the federal rule. Do not assume Hudson protects you in a state prosecution."
    ]
  },
  {
    name:"Horton v. California", cite:"496 U.S. 128 (1990)", court:"scotus", std:"pc", tags:["entry","arrest"],
    holding:"Inadvertence is not a necessary condition of a plain-view seizure. If an officer is lawfully in a position to view an item, its incriminating character is immediately apparent, and he has a lawful right of access to it, he may seize it — even if he expected to find it.",
    street:[
      "Three elements: lawfully there, incriminating nature immediately apparent, lawful access to it.",
      "You do NOT have to be surprised. Expecting to find it does not defeat plain view.",
      "'Immediately apparent' means without further searching. Moving an object to read its serial number is a search (Hicks)."
    ]
  },
  {
    name:"Hiibel v. Sixth Judicial District Court of Nevada", cite:"542 U.S. 177 (2004)", court:"scotus", std:"rs", tags:["terry","arrest"],
    holding:"A state may require a suspect lawfully detained on reasonable suspicion to disclose his name, and may criminalise the refusal. The request must be reasonably related to the circumstances justifying the stop. Disclosing a name does not, on these facts, violate the Fifth Amendment.",
    street:[
      "You may compel a NAME during a lawful Terry stop — if the state has a statute requiring it.",
      "TEXAS IS NARROWER: Penal Code § 38.02(a) only requires a name, address, and DOB from a person who has been lawfully ARRESTED. A detainee commits no offence by refusing to identify — but he may not give a FALSE name (§ 38.02(b)).",
      "Know the difference. Arresting a mere detainee for refusing to give a name is a false arrest in Texas."
    ]
  }
]
;