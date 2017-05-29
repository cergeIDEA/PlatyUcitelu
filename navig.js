
var navig = [
		{
				"text": "Výdaje na studenta",
				"x" : -150,
	  	  "y" : -150,
				"rx" : 50,
				"ry" : 50,
				"children" : [
						{		"varName" : "studentYearExp1",
								"relx" : 50,
								"rely" : 50,
								"fullName":"Roční výdaje na studenta na 1. stupni ZŠ",
								"shortName": "Roční na 1. stupni"
						},
						{  "varName" : "studentYearExp2",
								"relx" : 50,
								"rely" : -50,
								"fullName":"Roční výdaje na studenta na 2. stupni ZŠ",
								"shortName": "Roční na 2. stupni"
						},
						{
							  "varName" : "studentCumExp1",
								"relx" : 50,
								"rely" : 50,
								"fullName":"Kumulované výdaje na studenta během očekávané doby trvání studia na 1. stupni ZŠ",
								"shortName": "Kumulované na 1. stupni"
						},
						 {  "varName" : "studentCumExp2",
								"relx" : 50,
								"rely" : -50,
								"fullName":"Kumulované výdaje na studenta během očekávané doby trvání studia na 2. stupni ZŠ",
								"shortName": "Kumulované na 2. stupni"
						}

			],
			{
					"text": "Makroekonomické výdaje",
					"x" : 100,
		  	  "y" : -150,
					"rx" : 200,
					"ry" : 100,
					"children" : [
							 {  "varName" : "publicExp",
									"relx" : 50,
									"rely" : 50,
									"fullName":"Veřejné výdaje na vzdělávací instituce jako podíl na HDP",
									"shortName": "Veřejné výdaje vůči HDP"
							},
							{
								  "varName" : "privateExp",
									"relx" : 50,
									"rely" : -50,
									"fullName":"Soukromé výdaje na vzdělávací instituce jako podíl na HDP",
									"shortName": "Soukromé výdaje vůči HDP"
							},
							{
								  "varName" : "totalExp"
									"relx" : 50,
									"rely" : 50,
									"fullName":"Celkové výdaje na vzdělávací instituce jako podíl na HDP",
									"shortName": "Celkové výdaje vůči HDP"
							},
							{
								  "varName" : "educExpSh",
									"relx" : 50,
									"rely" : -50,
									"fullName": "Celkové veřejné výdaje na vzdělávání jako podíl na celkových veřejných výdajích",
									"shortName":"Podíl na celkových veřejných 	výdajích"
							}
					]
				}
			}
];
