from parrot import Parrot
import torch
import warnings
warnings.filterwarnings("ignore")
from googletrans import Translator

translator  = Translator()
contents='''අඩ අඳුරේ මා දෙනෙත් කවුලු හැර
අලසව වැතිරී තනි යහනේ
ඔබ ගැන සිතමින් බලා සිටින්නෙමි
මුලු ලොව නිසලව නිදන වෙලේ
දහසක් කවි කල්පනා මගේ
සිතෙහි හෙමිට පිළිසිඳෙහි තිබේ
එක්වී ඔබ සිහිනෙක දැවටී
නිනද සමඟ යහනට ඇවිදින්
අලුයම බොල්පිණි තැවරී තෙත්වුනු
අඳුරේ සීතල සලුව යටින්
හොරෙන් හොරෙන් ඔබ යනවිට ඒ හඬ
කෙමෙන් බිඳී මට නෑසී යයි
නිදිමත පලවා දෙනෙත් කවුලු හැර
ඔබ සොයනා මට ඔබ නොපෙනේ
දහසක් කවි කල්පනා මගේ
සිතෙහි යලිත් පිළිසිඳෙහි තිබේ
'''
result = translator.translate(contents)
print(result.text)


''' 
uncomment to get reproducable paraphrase generations
def random_state(seed):
  torch.manual_seed(seed)
  if torch.cuda.is_available():
    torch.cuda.manual_seed_all(seed)

random_state(1234)
'''

#Init models (make sure you init ONLY once if you integrate this to your code)
parrot = Parrot(model_tag="prithivida/parrot_paraphraser_on_T5")

phrases = ["Can you recommend some upscale restaurants in Newyork?",
           "What are the famous places we should not miss in Russia?"
]

for phrase in phrases:
  print("-"*100)
  print("Input_phrase: ", phrase)
  print("-"*100)
  para_phrases = parrot.augment(input_phrase=phrase, use_gpu=False)
  for para_phrase in para_phrases:
   print(para_phrase)
https://colab.research.google.com/drive/1UaHYG0S09MwJhBDIet_8t_y-FNNGH2tg?authuser=1