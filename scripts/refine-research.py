from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'dist/research.html'
s=p.read_text(encoding='utf-8')
old='<h2>De bronnen, met hun grenzen</h2>'
assert old in s
new='''<h2>De rol van de les in de klas</h2><article class="requirement"><h3>Zelfstandig leren, gevolgd door uitwisseling en verdieping</h3><p>De adventure moet zelfstandig de kerninhoud leren. Bij blended inzet komt daar een geplande lesactiviteit bij: studenten vergelijken hun onderbouwde keuzes, bespreken aannames en verbeteren hun voorstel na kritische vragen.</p><ol>${r.evaluationPlan.blendedIntegrationExtension.exampleSequence.map(x=>`<li>${e(x)}</li>`).join('')}</ol><details><summary>De rol van de docent en de zelfstandige route</summary><p>${e(r.evaluationPlan.blendedIntegrationExtension.teacherRole)}</p><p>${e(r.evaluationPlan.blendedIntegrationExtension.standaloneEquivalent)}</p><p>${e(r.evaluationPlan.blendedIntegrationExtension.comparisonDesign)}</p></details></article><h2>De bronnen, met hun grenzen</h2>'''
s=s.replace(old,new)
p.write_text(s,encoding='utf-8')
print('Added the explicit blended-learning sequence and standalone learning requirement.')
