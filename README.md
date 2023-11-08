Ovo je projekat tima Neuron Horizon na ovogodišnju temu zadatka "IgrANNonica" iz predmeta Softversko inženjerstvo.

Portovi koji su potrebni za rad aplikacije su:
10030 - front
10033 - back
10036 - ML

Na master grani se nalazi poslednja validna verzija projekta, dok je dev grana, grana za razvijanje novih funkcionalnosti. Na dev grani rade članovi tima, dok vođa tima spaja dev i master granu.
Pre nego što startujete aplikacije, potrebno je da odradite par korekcija u kodu. 
Da bi lokacija radila lokalno, odnosno na serveru 
1. u folderu app\front-end\NeuronFront\src\app\constants se nalazi constants.service fajl u kom treba da setujete IP adresu računara na kom se nalazi backend server
2. u app\back-end\NeuronBack\NeuronBack se nalazi appsettings.json fajl gde se definišu IP adrese
back servera i Python servera.

Pokretanje aplikacije na serveru 
1. Kako bi aplikacija radila ispravno, prvo startujte ML servis cd ann\python3 main.py.
2. Startujte back server cd neuron-back\dotnet NeuronBack.dll
3. Startujte front cd neuron-front\python3 -m front-server-2.py
4. U browseru (Firefox) otvorite softeng.pmf.kg.ac.rs

Želimo Vam prijatan rad :D
Tim Neuron Horizon 