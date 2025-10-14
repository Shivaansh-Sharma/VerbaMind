import language_tool_python
tool=language_tool_python.LanguageTool('en-US')
def check(text):
    matches=tool.check(text)
    if not matches:
        print("No errors were found !")
    else:
        print("Errors found !")
        for match in matches:
            print(f"{match.message}")
            print(f"Suggestions: {match.replacements}")
            print(f"At: {match.context}")


text="""I’ve been the “handyman” of the house for as long as I can remember. I started out, armed with a roll of duct tape looped around my chubby child arms as I marched about the house, waiting for my mother to call on me. In those days, I didn’t know much about the technical details but knew the phrase “duct tape fixes everything.” My dad would say it as I helped my mother fix tears in folders, boxes, and even a picture frame.

I picked up sewing around third grade, when my younger sister had started to get a bit too rough with her stuffed toys. I had gotten the gist, practicing on scrap fabric, before opening shop to the slew of well-loved but torn stuffed toys me and my sister shared. My stitchwork became so good, my mother would ask that I mend and alter some of her clothes. I remember the feeling of the pin pricking my finger every time I let the needle slip, but I also know the feeling of accomplishment as the mended toys were returned to my sister, and the altered clothes fit my mother like a glove.

Carpentry became my next venture, thanks to our two large dogs, Jake and Elwood. They were lovable oafs that would try to peek through the fence at passersby. However, since they were the size of grown men, they wore down the boards and eventually broke through the fence. My father and I spent the weekend removing worn boards, measuring, obtaining new wood, and skillfully cutting and nailing replacements. The project taught me to handle larger materials. I even challenged myself to build an outdoor table and seat using the remaining boards, taking care to stain the wood and sand sharp edges. I felt a jolt of victory when my dad had sat down and the wood had not collapsed beneath him.

Entering high school, my desire to continue building led me to the school’s robotics team, introducing me to 3D modeling and printers. Proficiency in CAD and the school’s printers fueled my ambition to expand my skills beyond school projects. After extensive research and persuasion, my dad invested in a 3D printer, enabling me to create replacements for furniture, hooks, and even crafting personal items like a sock drawer organizer and a cat toy. Requests from friends, like modeling and printing a vacuum switch replacement, added a new dimension to my handiness.

My handyman journey extended to auto mechanics in sophomore year when I took the reins of the family’s aging 1993 Ford F250. Despite its challenges—poor mileage and years of wear and tear—I refused to let it fail. Not long into driving the truck, the speedometer stopped working, and there was a clunking sound when it drove. After heavy inspection, we found that the speed sensor had come apart and lodged itself in the rear differential. As my father was getting old and not as spry as he used to be, he relied on me to open the differential and grab the piece, before flushing out metal shards and installing a new sensor. A year after the sensor failure, the suspension started to fail, requiring new shocks. The truck was a cycle of things breaking and being fixed, but it also taught me the more common skills of routine oil changes and how to jump start the battery.

In the end, my journey as the household “handyman” has been a continuous evolution. From early days with duct tape to mastering sewing, carpentry, 3D printing, and auto mechanics, each skill acquired has not only enhanced my technical prowess but also cultivated a sense of responsibility and determination. The diverse challenges I’ve tackled have molded my growth, instilling a resilient spirit that thrives on the joy of learning through hands-on experience."""
check(text)