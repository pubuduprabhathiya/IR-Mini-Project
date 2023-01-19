import requests
from string import ascii_lowercase as alc
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
from selenium import webdriver
import xlsxwriter
import re

def RemoveUnnessary(lyrics):
    print(lyrics)
    structured_lyrics = ''
    for i in range(len(lyrics)):
        updated_string = re.sub(r'[a-zA-Z] |[a-zA-Z]|\d|\t|#|[\([{})\]]|-|,|∆|—|\/|\'|\|+|', '', lyrics[i])
        structured_lyrics += updated_string
    temp=structured_lyrics.splitlines()
    output=""
    for word in temp:
        if(not word.isspace() and len(word)>0 and not word.__contains__("+")):
            output+=f"{word}\n"
    return output
workbook = xlsxwriter.Workbook('songs2.xlsx')
worksheet = workbook.add_worksheet()
row_num = 0

driver = webdriver.Edge()

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0','Accept-Language': 'en-US,en;q=0.5',"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,/;q=0.8"}
artists={"clarence-wijewardena","t-m-jayarathna","sunil-edirisinghe","karunaratna-divulgane"}
for i in artists:
    print("Artist:- ",i,"row num:- ",row_num)
    response = requests.get(f"https://www.sinhalasongbook.com/category/{i}",headers = HEADERS)
    soup = BeautifulSoup(response.content, 'html.parser')
    search_navigation_div = soup.find('div', {'class': 'archive-pagination pagination'})
    uls = search_navigation_div.find_all('ul')
    for ul in uls:
        for li in ul.find_all('li'):
            link = li.find('a')
            if link:
                response = requests.get(link['href'],headers = HEADERS)
                soup = BeautifulSoup(response.content, 'html.parser')
                divs = soup.find_all('a', class_='entry-title-link')
                for a in divs:
                    res = requests.get(a['href'],headers = HEADERS)
                    soup2 = BeautifulSoup(res.content, 'html.parser')
                    song_div = soup2.find('div', class_='su-column su-column-size-3-5')
                    try:
                        song_name = soup2.find('div', class_='entry-content').h2.text
                        artist= soup2.find('div',id="artistLinkButton").span.a.text

                        song=soup2.find('pre')#song_div.pre
                        print(song.text)
                        lyrics=RemoveUnnessary(song.text)
                        genue=soup2.find('span', class_='entry-tags').a.text
                        music=soup2.find('span', class_='music').a.text
                        writer=soup2.find('span', class_='lyrics').a.text
                        worksheet.write(row_num, 0, song_name)
                        worksheet.write(row_num, 1, lyrics)
                        worksheet.write(row_num, 2, artist)
                        worksheet.write(row_num, 3, genue)
                        worksheet.write(row_num, 4, music)
                        worksheet.write(row_num, 5, writer)
                        row_num += 1
                    except:
                        continue

driver.quit()
workbook.close()

