import requests
from string import ascii_lowercase as alc
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
from selenium import webdriver
import xlsxwriter

# writes to XL file
workbook = xlsxwriter.Workbook('songs.xlsx')
# opens worksheet
worksheet = workbook.add_worksheet()
# row nums in XL worksheet
row_num = 0

# selenium web driver for edge
driver = webdriver.Edge()

# headers for requests
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0','Accept-Language': 'en-US,en;q=0.5',"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,/;q=0.8"}
artists={"30-clarence-wijewardena.html","8-jayarathna-t-m.html","3-sunil-edirisinghe.html","16-karunarathna-diwlgane.html"}
# since lyricslk has sorted songs by english alphabet use alphabet to create links
for i in artists:
    response = requests.get(f"http://lyricslk.com/lyrics/artist/{i}",headers = HEADERS)
    soup = BeautifulSoup(response.content, 'html.parser')
     # Find the div element with the id attribute set to searchNavigation
    search_navigation_div = soup.find('div', {'id': 'searchNavigation'})
    # Find all the ul elements inside the div element
    uls = search_navigation_div.find_all('ul')
    # Iterate over the ul elements and extract the links in the list items
    for ul in uls:
        for li in ul.find_all('li'):
            link = li.find('a')
            if link:
                response = requests.get(link['href'],headers = HEADERS)
                soup = BeautifulSoup(response.content, 'html.parser')
                divs = soup.find_all('div', class_='ResTitleSin')
                for div in divs:
                    song_link = div.a['href']
                    driver.get(song_link)
                    song = driver.find_element(By.ID, 'lyricsBody')
                    songInfo = driver.find_element(By.ID, 'lyricsTitle')
                    data=songInfo.text.split("-")
                    data2=data[1].split("\n")
                    print(data)
                    worksheet.write(row_num, 0, song.text)
                    worksheet.write(row_num, 1, f"{data[0]}\n{data2[1]}")
                    worksheet.write(row_num, 2, f"{data2[0]}\n{data[2]}")
                    row_num += 1
driver.quit()
workbook.close()