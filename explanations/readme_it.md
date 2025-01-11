# Spiegazione

Ogni unità ha delle statistiche e queste statistiche, come sappiamo, influiscono sulle competenze di questa unità; vanno però anche ad influire sul lavoro che quell'unità può svolgere, che a sua volta aggiunge bonus a determinate competenze.

Per ogni caratteristica, ogni 2 punti sopra il 10 aggiungono un bonus di +1 alle competenze che la richiedono (arrotondato per difetto), mentre ogni 2 punti sotto al 10 aggiungono un malus di -1 (arrotondato per accesso).

Consideriamo un'unità con le seguenti statistiche:

**Fo: 10**  
**Ag: 7**  
**Co: 13**  
**In: 10**  
**Sa: 19**  
**Ca: 7**

Se prendiamo in esempio *Giardinaggio*, che richiede **Sa/Co/In**, questa unità avrà un bonus di +5  
Se prendiamo in esempio *Carpenteria*, che richiede **Ag/Fo/Co**, questa unità avrà un bonus di 0  
Se prendiamo in esempio *Smaltatura*, che richiede **Ag**, questa unità avrà un bonus di -1

La formula per calcolare il bonus dato da una caratteristica è la seguente:
```
((car - 10) / 2)
```
dove car è la caratteristica necessaria all'albilità. Se un'abilità' richiede più caratteristiche basta sommare i singoli bonus

Prendendo gli esempi di prima avremo:

*Giardinaggio*: [((19 - 10) / 2) = 4] + [((13 - 10) / 2) = 1] + [((10 - 10) / 2) = 0] = 5  
*Carpenteria*: [((7 - 10) / 2) = -1] + [((10 - 10) / 2) = 0] + [((13 - 10) / 2) = 1] = 0  
*Smaltatura*: ((7 - 10) / 2) = -1

Bisogna considerare che, nel gioco, questi calcoli tengono conto di bonus e malus presenti e che possono essere dati da:

- Giorno
- Locazione
- Equipaggiamento
- Reliquie
- Altro

I quali possono essere visualizzati nell'Enciclopedia. I bonus dati vanno considerati con una qualità del 50% (Dimezzata a 0% e Raddoppiata al 100%)

Es. *Zappe* +5 a giardinaggio con qualità del 50%, +2 a 0% e +10 al 100%

Infine a questi occorre sommare bonus e malus dati dalla professione

Es. *Giardiniere* +5 a giardinaggio

Perciò, considerando la nostra unità
- giardiniere (+5 giardinaggio)
- il giorno 11/01/2025 (+1 Sa, +2 Co) - l'incremento porta il bonus dato dalle statistiche a +7
- in un giardino al 50% di qualità (+10 giardinaggio)
- equipaggiato con zappe al 50% di qualità (+5 giardinaggio)
- senza considerare altri fattori

Avremo che avrà un totale di 5+7+10+5 = +27 a giardinaggio

## Note

- I bonus dati dalle professioni sono positivi solo se presenti in quella professione, altrimenti si ha un malus di -20.
Quindi un giardiniere, che ha bonus a Giardinaggio, Raccolta della frutta, Piantumazione, Aratura e Agrimensura, di base, avrà -20 a tutte le altre abilità.