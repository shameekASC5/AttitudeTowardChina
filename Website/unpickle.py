import pickle
import pandas 

bachelor = open("bachelor-by-field.pickle4", 'rb')
output = pickle.load(bachelor)
bachelor.close()
print(output)

doctoral = open("doctoral-by-field.pickle4", 'rb')
output = pickle.load(doctoral)
doctoral.close()
print(output)
